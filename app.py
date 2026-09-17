from flask import Flask, render_template, request, jsonify, session
from database import create_tables, get_db_connection
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

app.secret_key = "change-this-secret-key"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/api/login", methods=["POST"])
def login_user():
    data = request.get_json()

    email = data["email"]
    password = data["password"]

    connection = get_db_connection()

    user = connection.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    ).fetchone()

    connection.close()

    if user is None:
        return jsonify({
            "message": "Invalid email or password."
        }), 401

    password_correct = check_password_hash(
        user["password"],
        password
    )

    if not password_correct:
        return jsonify({
            "message": "Invalid email or password."
        }), 401

    session["user_id"] = user["id"]
    session["user_name"] = user["name"]

    return jsonify({
        "message": "Login successful!"
    })

@app.route("/signup")
def signup():
    return render_template("signup.html")

@app.route("/api/signup", methods=["POST"])
def signup_user():
    data = request.get_json()

    name = data["name"]
    email = data["email"]
    password = data["password"]

    connection = get_db_connection()

    existing_user = connection.execute(
        "SELECT id FROM users WHERE email = ?",
        (email,)
    ).fetchone()

    if existing_user:
        connection.close()

        return jsonify({
            "message": "Email already registered."
        }), 409

    hashed_password = generate_password_hash(password)

    connection.execute(
        """
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
        """,
        (name, email, hashed_password)
    )

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Account created successfully!"
    })

@app.route("/dashboard")
def dashboard():

    if "user_id" not in session:
        return render_template("login.html")
    
    return render_template("dashboard.html")

@app.route("/logout")
def logout():
    session.clear()
    return render_template("login.html")

@app.route("/api/subjects", methods=["POST"])
def add_subject():

    if "user_id" not in session:
        return jsonify({
            "message": "Please login first."
        }), 401

    data = request.get_json()

    name = data["name"]
    difficulty = data["difficulty"]

    user_id = session["user_id"]

    connection = get_db_connection()

    cursor = connection.execute(
        """
        INSERT INTO subjects (user_id, name, difficulty)
        VALUES (?, ?, ?)
        """,
        (user_id, name, difficulty)
    )

    connection.commit()

    subject_id = cursor.lastrowid

    connection.close()

    return jsonify({
        "message": "Subject added successfully!",
        "id": subject_id
    })

@app.route("/subjects")
def subjects():

    if "user_id" not in session:
        return render_template("login.html")

    return render_template("subjects.html")

@app.route("/api/subjects", methods=["GET"])
def get_subjects():

    if "user_id" not in session:
        return jsonify({
            "message": "Please login first."
        }), 401

    user_id = session["user_id"]

    connection = get_db_connection()

    subjects = connection.execute(
        """
        SELECT * FROM subjects
        WHERE user_id = ?
        """,
        (user_id,)
    ).fetchall()

    connection.close()

    return jsonify([
        dict(subject)
        for subject in subjects
    ])

@app.route("/api/subjects/<int:subject_id>", methods=["DELETE"])
def delete_subject(subject_id):

    if "user_id" not in session:
        return jsonify({
            "message": "Please login first."
        }), 401

    user_id = session["user_id"]

    connection = get_db_connection()

    connection.execute(
        """
        DELETE FROM subjects
        WHERE id = ? AND user_id = ?
        """,
        (subject_id, user_id)
    )

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Subject deleted successfully!"
    })

create_tables()

if __name__ == "__main__":
    app.run(debug=True)
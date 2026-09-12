from flask import Flask, render_template, request, jsonify
from database import create_tables, get_db_connection

app = Flask(__name__)


# =========================
# HOME
# =========================

@app.route("/")
def home():
    return render_template("index.html")


# =========================
# LOGIN
# =========================

@app.route("/login")
def login():
    return render_template("login.html")


# =========================
# SIGNUP
# =========================

@app.route("/signup")
def signup():
    return render_template("signup.html")


# =========================
# DASHBOARD
# =========================

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


# =========================
# SUBJECTS
# =========================

@app.route("/subjects")
def subjects():
    return render_template("subjects.html")


# =========================
# ADD SUBJECT
# =========================

@app.route("/api/subjects", methods=["POST"])
def add_subject():

    data = request.get_json()

    name = data["name"]
    difficulty = data["difficulty"]

    connection = get_db_connection()

    cursor = connection.execute(
        """
        INSERT INTO subjects (name, difficulty)
        VALUES (?, ?)
        """,
        (name, difficulty)
    )

    connection.commit()

    subject_id = cursor.lastrowid

    connection.close()

    return jsonify({
        "message": "Subject added successfully!",
        "id": subject_id
    })


# =========================
# GET SUBJECTS
# =========================

@app.route("/api/subjects", methods=["GET"])
def get_subjects():

    connection = get_db_connection()

    subjects = connection.execute(
        "SELECT * FROM subjects"
    ).fetchall()

    connection.close()

    return jsonify([dict(subject) for subject in subjects])


# =========================
# DELETE SUBJECT
# =========================

@app.route("/api/subjects/<int:subject_id>", methods=["DELETE"])
def delete_subject(subject_id):

    connection = get_db_connection()

    connection.execute(
        "DELETE FROM subjects WHERE id = ?",
        (subject_id,)
    )

    connection.commit()

    connection.close()

    return jsonify({
        "message": "Subject deleted successfully!"
    })


# =========================
# CREATE TABLES
# =========================

create_tables()


# =========================
# START FLASK
# =========================

if __name__ == "__main__":
    app.run(debug=True)
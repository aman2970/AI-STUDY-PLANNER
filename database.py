import sqlite3


# =========================
# DATABASE CONNECTION
# =========================

def get_db_connection():

    connection = sqlite3.connect("study_planner.db")

    connection.row_factory = sqlite3.Row

    return connection


# =========================
# CREATE TABLES
# =========================

def create_tables():

    connection = get_db_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS subjects (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            difficulty TEXT NOT NULL

        )
    """)

    connection.commit()

    connection.close()
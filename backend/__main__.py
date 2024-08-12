from flask import Flask, render_template, jsonify
import psycopg2
import os

app = Flask(__name__)

# Database connection parameters
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_PORT = os.environ.get('DB_PORT', '5432')
DB_NAME = os.environ.get('DB_NAME', 'postgres')
DB_USER = os.environ.get('DB_USER', 'myuser')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'mypassword')

def get_db_connection():
    connection = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    return connection


@app.route('/')
def home():
    return 'hello test'

@app.route('/application', methods=['GET'])
def get_applications():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM application.application')
    rows = cursor.fetchall()
    cursor.close()
    connection.close()

    # Assuming the rows are tuples of the form (id, name, ...)
    applications = [dict(zip([desc[0] for desc in cursor.description], row)) for row in rows]
    return jsonify(applications)

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
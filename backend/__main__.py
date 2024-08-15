import logging

from flask import Flask
from flask_cors import CORS
import os

from database.database import DatabaseConnection
from services import ApplicationService, InteractionService
from controllers import ApplicationController, InteractionController

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes and origins


@app.route('/')
def home():
    return 'hello test'


if __name__ == "__main__":
    # Create a DatabaseConnection instance
    db = DatabaseConnection(
        db_type='postgres',
        host=os.environ.get('DB_HOST', 'localhost'),
        port=os.environ.get('DB_PORT', '5432'),
        database=os.environ.get('DB_NAME', 'postgres'),
        user=os.environ.get('DB_USER', 'myuser'),
        password=os.environ.get('DB_PASSWORD', 'mypassword')
    )

    # Create Services
    application_service = ApplicationService(db)
    interaction_service = InteractionService(db)

    # Create Applications
    application_controller = ApplicationController(application_service)
    interaction_controller = InteractionController(interaction_service)

    # Register routes
    application_controller.register_routes(app)
    interaction_controller.register_routes(app)

    # Run the Flask app
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)

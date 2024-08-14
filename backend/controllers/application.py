import logging

from flask import jsonify, request
from models import Application
from services import ApplicationService

class ApplicationController:
    def __init__(self, service: ApplicationService):
        self.service = service

        # Set up logging
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.DEBUG)  # Set the logging level
        handler = logging.StreamHandler()  # You could also use FileHandler to log to a file
        handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
        self.logger.addHandler(handler)

    def register_routes(self, app):
        @app.route('/application', methods=['GET'])
        def get_applications():
            try:
                applications = self.service.get_all()
                return jsonify(applications)
            except Exception as e:
                self.logger.error(f"Error fetching applications: {e}")
                return jsonify({"error": "Unable to fetch applications"}), 500

        @app.route('/application', methods=['POST'])
        def save_applications():
            try:
                json_data = request.get_json()

                if not json_data:
                    return jsonify({"error": "No input data provided"}), 400

                application = Application.from_json(json_data)
                persisted = self.service.save(application)

                return jsonify(Application.to_dict(persisted)), 201

            except Exception as e:
                self.logger.error(f"Error saving application: {e}")
                return jsonify({"error": str(e)}), 500

        @app.route('/application/<string:application_id>', methods=['DELETE'])
        def delete_application(application_id):
            try:
                self.logger.debug(f"Attempting to delete application with ID: {application_id}")

                # Call the delete method from the service
                self.service.delete(application_id)

                # Return a success response
                return jsonify({"message": "Application deleted successfully"}), 200

            except Exception as e:
                self.logger.error(f"Error deleting application: {e}")
                return jsonify({"error": str(e)}), 500
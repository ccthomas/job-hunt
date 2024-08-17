import logging
from flask import jsonify, request, Flask
from pydantic import ValidationError

from services import ApplicationService
from utils import setup_logger
from models import Application


class ApplicationController:
    def __init__(self, service: ApplicationService):
        self.service = service
        self.logger = setup_logger(__name__, level=logging.DEBUG)

    def register_routes(self, app: Flask):
        @app.route('/application', methods=['GET'])
        def get_applications():
            self.logger.debug("Received GET request for /application")
            try:
                applications = self.service.get_all()

                self.logger.debug(f"Applications Retrieved {len(applications)}.")
                # Convert the list of Application objects to dictionaries for JSON serialization
                applications_dict = [application.to_dict() for application in applications]
                self.logger.debug(f"Returning {len(applications_dict)} applications")
                return jsonify(applications_dict)
            except Exception as e:
                self.logger.error(f"Error fetching applications: {e}")
                return jsonify({"error": "Unable to fetch applications"}), 500

        @app.route('/application', methods=['POST'])
        def save_application():
            self.logger.debug("Received POST request for /application")
            json_data = request.get_json()
            self.logger.debug(f"Request JSON data: {json_data}")

            if not json_data:
                self.logger.warning("No input data provided")
                return jsonify({"error": "No input data provided"}), 400

            try:
                # Create Application instance using Pydantic
                application = Application.from_json(json_data)
                self.logger.debug(f"Validated application data: {application.to_dict()}")

                persisted = self.service.save(application)
                self.logger.debug(f"Application saved with ID: {persisted.application_id}")
                return jsonify(persisted.to_dict()), 201
            except ValidationError as ve:
                # Extract detailed validation errors
                error_details = ve.errors()
                self.logger.error(f"Invalid data provided: {error_details}")
                return jsonify({
                    "error": "Invalid data provided",
                    "details": error_details
                }), 400

            except Exception as e:
                self.logger.error(f"Error saving application: {e}")
                return jsonify({"error": str(e)}), 500

        @app.route('/application/<string:application_id>', methods=['DELETE'])
        def delete_application(application_id: str):
            self.logger.debug(f"Received DELETE request for /application/{application_id}")
            try:
                self.logger.debug(f"Attempting to delete application with ID: {application_id}")

                # Call the delete method from the service
                self.service.delete(application_id)
                self.logger.info(f"Application with ID: {application_id} deleted successfully")

                # Return a success response
                return jsonify({"message": "Application deleted successfully"}), 200
            except Exception as e:
                self.logger.error(f"Error deleting application: {e}")
                return jsonify({"error": str(e)}), 500

import logging
from logging import Logger

from flask import jsonify, request
from pydantic import ValidationError
from models import Interaction, InteractionType
from services import InteractionService
from utils import setup_logger


class InteractionController:
    def __init__(self, service: InteractionService):
        self.service = service
        self.logger = setup_logger(__name__, level=logging.DEBUG)

    def register_routes(self, app):
        @app.route('/application/interaction', methods=['GET'])
        def get_interactions():
            application_id = request.args.get('application_id')

            try:
                self.logger.debug(f"Attempting to get interactions with query param application ID: {application_id}")

                # Call the service method to get interactions by application ID
                interactions = self.service.get_all(application_id)

                interactions_dict = [interaction.to_dict() for interaction in interactions]

                self.logger.debug(f"Got interactions with query param application ID: {interactions_dict}")

                if not interactions_dict:
                    return jsonify({"message": "No interactions found for this application ID"}), 404

                return jsonify(interactions_dict), 200

            except Exception as e:
                self.logger.error(f"Error fetching interactions: {e}")
                return jsonify({"error": str(e)}), 500

        @app.route('/application/interaction', methods=['POST'])
        def save_interaction():
            try:
                json_data = request.get_json()

                if not json_data:
                    return jsonify({"error": "No input data provided"}), 400

                # Create Interaction instance from JSON
                interaction = Interaction.from_json(json_data)

                # Save the interaction
                persisted = self.service.save(interaction)

                self.logger.debug(f"Application saved with ID: {persisted.interaction_id}")
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
                app.logger.error(f"Error saving interaction: {e}")
                return jsonify({"error": str(e)}), 500

        @app.route('/application/interaction/<string:interaction_id>', methods=['DELETE'])
        def delete_interaction(interaction_id):
            try:
                self.logger.debug(f"Attempting to delete interaction with ID: {interaction_id}")

                # Call the delete method from the service
                self.service.delete(interaction_id)

                # Return a success response
                return jsonify({"message": "Interaction deleted successfully"}), 200

            except Exception as e:
                self.logger.error(f"Error deleting interaction: {e}")
                return jsonify({"error": str(e)}), 500

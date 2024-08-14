import logging

from flask import jsonify, request
from models import Interaction, InteractionType
from services import InteractionService

class InteractionController:
    def __init__(self, service: InteractionService):
        self.service = service

        # Set up logging
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.DEBUG)  # Set the logging level
        handler = logging.StreamHandler()  # You could also use FileHandler to log to a file
        handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
        self.logger.addHandler(handler)

    def register_routes(self, app):
        @app.route('/application/interaction', methods=['GET'])
        def get_interactions():
            application_id = request.args.get('application_id')

            try:
                self.logger.debug(f"Attempting to get interactions with query param application ID: {application_id}")

                # Call the service method to get interactions by application ID
                interactions = self.service.get_all(application_id)

                self.logger.debug(f"Got interactions with query param application ID: {application_id}")

                if not interactions:
                    return jsonify({"message": "No interactions found for this application ID"}), 404

                return jsonify(interactions), 200

            except Exception as e:
                self.logger.error(f"Error fetching interactions: {e}")
                return jsonify({"error": str(e)}), 500

        @app.route('/application/interaction', methods=['POST'])
        def save_interaction():
            try:
                json_data = request.get_json()

                if not json_data:
                    return jsonify({"error": "No input data provided"}), 400

                # Validate and convert interaction type
                interaction_type_str = json_data.get('type')
                if interaction_type_str not in InteractionType.__members__:
                    return jsonify({"error": "Invalid interaction type"}), 400
                interaction_type = InteractionType(interaction_type_str)

                # Create Interaction instance from JSON
                interaction = Interaction.from_json(json_data)
                interaction.type = interaction_type  # Set the validated type

                # Save the interaction
                persisted = self.service.save(interaction)

                return jsonify(persisted.to_dict()), 201

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

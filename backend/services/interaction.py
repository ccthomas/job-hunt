import logging
from typing import List, Dict, Any
from uuid import uuid4
import psycopg2

from models import Interaction, InteractionType

class InteractionService:
    def __init__(self, db):
        self.db = db
        # Set up logging
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.DEBUG)  # Set the logging level
        handler = logging.StreamHandler()  # You could also use FileHandler to log to a file
        handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
        self.logger.addHandler(handler)

    def delete(self, interaction_id: str):
        connection = None
        cursor = None

        try:
            self.logger.debug(f"Attempting to connect to the database to delete interaction with ID: {interaction_id}.")
            connection = self.db.connect()
            cursor = connection.cursor()

            self.logger.debug("Executing query to delete interaction.")
            cursor.execute('''
                   UPDATE application.interaction
                   SET deleted_timestamp = CURRENT_TIMESTAMP
                   WHERE id = %(id)s
               ''', {
                'id': interaction_id
            })

            connection.commit()
            self.logger.debug(f"Interaction with ID {interaction_id} deleted successfully.")

        except psycopg2.Error as e:
            self.logger.error(f"Database error during delete: {e}")
            connection.rollback()

        finally:
            if cursor:
                self.logger.debug("Closing cursor.")
                cursor.close()
            if connection:
                self.logger.debug("Closing database connection.")
                connection.close()

    def get_all(self, application_id = None) -> List[Dict[str, Any]]:
        connection = None
        cursor = None

        try:
            self.logger.debug("Connecting to the database.")
            connection = self.db.connect()
            cursor = connection.cursor()

            self.logger.debug("Executing query to get all interactions.")
            cursor.execute('''
            SELECT
                id,
                application_id,
                name,
                company,
                job_title,
                type,
                rating,
                notes,
                interaction_timestamp
            FROM 
                application.interaction
            WHERE
                deleted_timestamp IS NULL
            AND (
                (%(application_id)s IS NOT NULL and application_id = %(application_id)s)
                or
                (%(application_id)s IS NULL)
            )
            ;''', {
                'application_id': application_id,
            })
            rows = cursor.fetchall()

            self.logger.debug(f"Retrieved {len(rows)} rows from the database.")

            # Convert rows to Interaction instances and then to dictionaries
            interactions = [Interaction(*row) for row in rows]

            self.logger.debug(f"Returning interactions: {interactions}.")
            return [interaction.to_dict() for interaction in interactions]

        except psycopg2.Error as e:
            self.logger.error(f"Database error: {e}")
            return []

        finally:
            if cursor:
                self.logger.debug("Closing cursor.")
                cursor.close()
            if connection:
                self.logger.debug("Closing database connection.")
                connection.close()

    def save(self, interaction: Interaction) -> Interaction:
        connection = None
        cursor = None

        if interaction.id is None:
            interaction.id = str(uuid4())
            self.logger.debug(f"Generated new UUID for interaction: {interaction.id}")

        if not self._validate_interaction_type(interaction.type):
            self.logger.error(f"Invalid interaction type: {interaction.type}")
            raise ValueError(f"Invalid interaction type: {interaction.type}")

        try:
            self.logger.debug("Connecting to the database.")
            connection = self.db.connect()
            cursor = connection.cursor()

            self.logger.debug("Executing query to save interaction.")
            cursor.execute('''
                INSERT INTO application.interaction (id, application_id, name, company, job_title, type, rating, notes, interaction_timestamp)
                VALUES (%(id)s, %(application_id)s, %(name)s, %(company)s, %(job_title)s, %(type)s, %(rating)s, %(notes)s, %(interaction_timestamp)s)
                ON CONFLICT (id) DO UPDATE
                SET
                    application_id = EXCLUDED.application_id,
                    name = EXCLUDED.name,
                    company = EXCLUDED.company,
                    job_title = EXCLUDED.job_title,
                    type = EXCLUDED.type,
                    rating = EXCLUDED.rating,
                    notes = EXCLUDED.notes,
                    interaction_timestamp = EXCLUDED.interaction_timestamp;
            ''', {
                'id': interaction.id,
                'application_id': interaction.application_id,
                'name': interaction.name,
                'company': interaction.company,
                'job_title': interaction.job_title,
                'type': interaction.type,
                'rating': interaction.rating,
                'notes': interaction.notes,
                'interaction_timestamp': interaction.interaction_timestamp
            })

            connection.commit()
            self.logger.debug("Interaction saved successfully.")

        except psycopg2.Error as e:
            self.logger.error(f"Database error: {e}")
            connection.rollback()

        finally:
            if cursor:
                self.logger.debug("Closing cursor.")
                cursor.close()
            if connection:
                self.logger.debug("Closing database connection.")
                connection.close()

        return interaction

    def _validate_interaction_type(self, interaction_type: str) -> bool:
        """Validate if the provided interaction type is valid."""
        self.logger.debug(f"Database error: {interaction_type}")
        return interaction_type in InteractionType

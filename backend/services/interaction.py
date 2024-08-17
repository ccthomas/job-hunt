import logging
from logging import Logger
from typing import List, Dict, Any
from uuid import uuid4
import psycopg2

from models import Interaction, InteractionType
from utils import setup_logger

class InteractionService:
    def __init__(self, db):
        self.db = db
        self.logger = setup_logger(__name__, level=logging.DEBUG)

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
            self.logger.debug(f"Map {rows} rows.")

            # Convert each row tuple to a dictionary
            self.logger.debug("Convert each row tuple to a dictionary.")
            interactions_dicts = [
                {
                    'interaction_id': row[0],
                    'application_id': row[1],
                    'name': row[2],
                    'company': row[3],
                    'job_title': row[4],
                    'interaction_type': row[5],
                    'rating': row[6],
                    'notes': row[7],
                    'interaction_timestamp': row[8]
                }
                for row in rows
            ]

            self.logger.debug(f"Convert rows to Interaction instances and then to dictionaries: {interactions_dicts}.")
            interactions = [Interaction(**data) for data in interactions_dicts]

            self.logger.debug(f"Returning interactions: {interactions}.")
            return interactions

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

        if interaction.interaction_id is None:
            interaction.interaction_id = str(uuid4())
            self.logger.debug(f"Generated new UUID for interaction: {interaction.interaction_id}")

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
                'id': interaction.interaction_id,
                'application_id': interaction.application_id,
                'name': interaction.name,
                'company': interaction.company,
                'job_title': interaction.job_title,
                'type': interaction.interaction_type,
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

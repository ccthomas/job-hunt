import logging
from logging import Logger
from typing import List, Dict, Any
from uuid import uuid4
import psycopg2

from models import Application
from utils import setup_logger


class ApplicationService:
    def __init__(self, db):
        self.db = db
        self.logger = setup_logger(__name__, level=logging.DEBUG)

    def delete(self, application_id: str):
        connection = None
        cursor = None

        try:
            self.logger.debug(f"Attempting to connect to the database to delete application with ID: {application_id}.")
            connection = self.db.connect()
            cursor = connection.cursor()

            self.logger.debug("Executing query to delete application.")
            cursor.execute('''
                   UPDATE application.application
                   SET deleted_timestamp = CURRENT_TIMESTAMP
                   WHERE id = %(id)s
               ''', {
                'id': application_id
            })

            connection.commit()
            self.logger.debug(f"Application with ID {application_id} deleted successfully.")

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

    def get_all(self) -> List[Application]:
        connection = None
        cursor = None

        try:
            self.logger.debug("Connecting to the database.")
            connection = self.db.connect()
            cursor = connection.cursor()

            self.logger.debug("Executing query to get all applications.")
            cursor.execute('''
            SELECT
                id,
                company,
                link text,
                job_title,
                applied_timestamp
            FROM 
                application.application
            WHERE
                deleted_timestamp IS NULL;''')
            rows = cursor.fetchall()

            self.logger.debug(f"Retrieved {len(rows)} rows from the database.")

            # Convert rows to Application instances and then to dictionaries
            applications = [Application(*row) for row in rows]
            return [app.to_dict() for app in applications]

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

    def save(self, application: Application) -> Application:
        connection = None
        cursor = None

        if application.id is None:
            application.id = str(uuid4())
            self.logger.debug(f"Generated new UUID for application: {application.id}")

        try:
            self.logger.debug("Connecting to the database.")
            connection = self.db.connect()
            cursor = connection.cursor()

            self.logger.debug("Executing query to save application.")
            cursor.execute('''
                INSERT INTO application.application (id, company, link, job_title, applied_timestamp)
                VALUES (%(id)s, %(company)s, %(link)s, %(job_title)s, %(applied_timestamp)s)
                ON CONFLICT (id) DO UPDATE
                SET
                    company = EXCLUDED.company,
                    link = EXCLUDED.link,
                    job_title = EXCLUDED.job_title,
                    applied_timestamp = EXCLUDED.applied_timestamp;
            ''', {
                'id': application.id,
                'company': application.company,
                'link': application.link,
                'job_title': application.job_title,
                'applied_timestamp': application.applied_timestamp
            })

            connection.commit()
            self.logger.debug("Application saved successfully.")

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

        return application

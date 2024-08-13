import os
import psycopg2
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseConnection:
    def __init__(self, db_type='sqlite', host='localhost', port=None, user=None, password=None, database=None):
        self.connection = None
        self.db_type = db_type
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.database = database

        logger.info(f"Initialized DatabaseConnection with db_type={self.db_type}, host={self.host}")

    def connect(self):
        if self.connection is None or self.connection.closed != 0:
            try:
                logger.info("Attempting to connect to the database...")
                self.connection = psycopg2.connect(
                    dbname=self.database,
                    user=self.user,
                    password=self.password,
                    host=self.host,
                    port=self.port
                )
                logger.info("Database connection established.")
            except Exception as e:
                logger.error(f"Error connecting to the database: {e}")
                return None
        else:
            logger.info("Already connected to the database.")

        return self.connection

    def get_connection_string(self):
        if self.db_type == 'postgresql':
            connection_string = f'postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}'
            logger.debug(f"Generated connection string: {connection_string}")
            return connection_string
        else:
            error_msg = f"Unsupported database type: {self.db_type}"
            logger.error(error_msg)
            raise ValueError(error_msg)

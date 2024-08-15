import logging

# Define a default formatter
default_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

def setup_logger(name, log_file=None, level=logging.INFO, formatter=default_formatter):
    """
    Setup a logger with the specified name, log file, logging level, and formatter.

    :param name: Name of the logger.
    :param log_file: Optional file to log messages to. If None, logs will be printed to stdout.
    :param level: Logging level (e.g., logging.DEBUG, logging.INFO).
    :param formatter: Optional formatter instance to format the log messages.
    :return: Configured logger instance.
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Clear existing handlers
    if logger.hasHandlers():
        logger.handlers.clear()

    # Create console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(level)
    if formatter:
        console_handler.setFormatter(formatter)

    logger.addHandler(console_handler)

    # Create file handler if log_file is specified
    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(level)
        if formatter:
            file_handler.setFormatter(formatter)

        logger.addHandler(file_handler)

    return logger

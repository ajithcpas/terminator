import logging
import os
from logging.handlers import TimedRotatingFileHandler


class Logger:
    def __init__(self):
        self.log_dir = os.environ.get('LOG_DIR')
        self.log_dir = os.path.join(os.getcwd(), "logs") if self.log_dir is None else self.log_dir
        self.log_file = os.environ.get('LOG_FILE')
        self.log_file = "sysout.log" if self.log_file is None else self.log_file
        self.log_level = os.environ.get('LOG_LEVEL')
        self.log_level = "INFO" if self.log_level is None else self.log_level

        self.logger = logging.getLogger('')
        self.logger.setLevel(self.log_level)

        if not os.path.exists(self.log_dir):
            os.makedirs(self.log_dir)
        file_log_handler = TimedRotatingFileHandler(os.path.join(self.log_dir, self.log_file), when="midnight",
                                                    interval=1)
        file_log_handler.suffix = "%Y-%m-%d"
        stderr_log_handler = logging.StreamHandler()

        formatter = logging.Formatter('%(asctime)s - [%(levelname)s] - %(message)s', '%Y-%b-%d %H:%M:%S')
        file_log_handler.setFormatter(formatter)
        stderr_log_handler.setFormatter(formatter)

        self.logger.addHandler(file_log_handler)
        self.logger.addHandler(stderr_log_handler)

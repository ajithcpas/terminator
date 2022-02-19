import os

from flask_bcrypt import Bcrypt

from broker.kotak.kotak_broker import KotakBroker
from utils.logger import Logger

ROOT_DIR = os.getcwd()
bcrypt = Bcrypt()
broker = KotakBroker()
logger = Logger()

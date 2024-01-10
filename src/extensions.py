import os

from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO

from broker.dummy_broker import DummyBroker
from broker.kotak.kotak_broker import KotakBroker
from utils.logger import Logger

ROOT_DIR = os.getcwd()
bcrypt = Bcrypt()
logger = Logger()
# socketio = SocketIO()
# broker = KotakBroker()
# broker.set_server_socketio(socketio)
broker = DummyBroker()

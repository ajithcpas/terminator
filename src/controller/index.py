import logging
import os

from flask import Blueprint
from flask import send_from_directory
from flask_socketio import emit

# from extensions import ROOT_DIR, socketio, broker
from extensions import ROOT_DIR, broker

index_bp = Blueprint('index_bp', __name__, url_prefix='/')
api_bp = Blueprint('api_bp', __name__, url_prefix='/api')

logger = logging.getLogger(__name__)


@index_bp.route("/", defaults={"path": ""})
@index_bp.app_errorhandler(404)
def index(path):
    static_folder = os.path.join(ROOT_DIR, "web")
    return send_from_directory(static_folder, 'index.html')


# @socketio.on('get data')
# def socket_get_data(instrument_tokens):
#     broker.get_live_ticks(instrument_tokens)
#
#
# @socketio.on('connect')
# def socket_connect():
#     logger.info("client websocket connected")
#     emit('ticker', "websocket connected successfully")
#
#
# @socketio.on('disconnect')
# def socket_disconnect():
#     logger.info("client websocket disconnected")

import logging
import os

from flask import Blueprint
from flask import send_from_directory

from extensions import ROOT_DIR, broker

index_bp = Blueprint('index_bp', __name__, url_prefix='/')
api_bp = Blueprint('api_bp', __name__, url_prefix='/api')

logger = logging.getLogger(__name__)


@index_bp.route("/", defaults={"path": ""})
@index_bp.app_errorhandler(404)
def index(path):
    try:
        broker.init_api()
    except Exception as e:
        logger.error(str(e))

    static_folder = os.path.join(ROOT_DIR, "web")
    return send_from_directory(static_folder, 'index.html')

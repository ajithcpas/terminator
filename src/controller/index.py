import os

from flask import Blueprint
from flask import send_from_directory

index_bp = Blueprint('index_bp', __name__, url_prefix='/')
api_bp = Blueprint('api_bp', __name__, url_prefix='/api')


@index_bp.route("/", defaults={"path": ""})
@index_bp.app_errorhandler(404)
def index(path):
    static_folder = os.path.join(os.getcwd(), "web")
    return send_from_directory(static_folder, 'index.html')

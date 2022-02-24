import logging

from controller.index import api_bp
from extensions import broker

logger = logging.getLogger(__name__)


@api_bp.route("/positions")
def positions():
    return broker.get_positions()

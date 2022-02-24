import logging

from controller.index import api_bp
from extensions import broker

logger = logging.getLogger(__name__)


@api_bp.route("/watchlists")
def watchlists():
    return broker.get_watchlists()

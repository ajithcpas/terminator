import logging

from controller.index import api_bp
from extensions import broker

logger = logging.getLogger(__name__)


@api_bp.route("/positions")
def positions():
    open_positions = broker.kotak_api.positions("OPEN")
    today_positions = broker.kotak_api.positions("TODAYS")
    response = {"open": open_positions["Success"], "todays": today_positions["Success"]}
    return response

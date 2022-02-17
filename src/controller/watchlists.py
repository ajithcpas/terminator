import logging

from flask import request

from controller.index import api_bp
from extensions import broker

logger = logging.getLogger(__name__)


@api_bp.route("/watchlists")
def watchlists():
    return broker.get_watchlists()


@api_bp.route("/watchlists/byName")
def get_watchlist():
    return broker.get_watchlist_by_name(request.args.get("name"))

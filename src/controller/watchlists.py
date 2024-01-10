import logging

from flask import request

from controller.index import api_bp
from extensions import broker

logger = logging.getLogger(__name__)


@api_bp.route("/watchlists")
def get_watchlists():
    return broker.get_watchlists()


@api_bp.route("/watchlists/byName")
def get_watchlists_by_name():
    return broker.get_watchlists_by_name(request.args.get("name"))

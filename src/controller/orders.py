import logging
from datetime import datetime

from flask import request

from controller.index import api_bp
from extensions import broker

logger = logging.getLogger(__name__)


@api_bp.route("/orders", methods=["GET"])
def order_report():
    orders = broker.kotak_api.order_report()
    for order in orders["success"]:
        from_datetime = datetime.strptime(order["orderTimestamp"], "%b %d %Y %I:%M:%S:%f%p")
        to_datetime = from_datetime.strftime("%H:%M:%S")
        order["orderTimestamp"] = to_datetime
    return orders


@api_bp.route("/place_order", methods=["POST"])
def place_order():
    order = request.json
    if "orderId" in order:
        logger.info(f'modify_order_request:: {order}')
        order["orderId"] = str(order["orderId"])
        return broker.modify_order(order)

    logger.info(f'place_order_request:: {order}')
    return broker.place_order(order)


@api_bp.route("/cancel_order", methods=["POST"])
def cancel_order():
    order = request.json
    logger.info(f'cancel_order_request:: {order}')
    return broker.cancel_order(order)

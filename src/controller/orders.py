import logging

from flask import request

from controller.index import api_bp
from extensions import broker

logger = logging.getLogger(__name__)


@api_bp.route("/orders", methods=["GET"])
def order_report():
    return broker.get_orders()


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

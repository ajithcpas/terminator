from controller.index import api_bp
from extensions import broker


@api_bp.route("/dashboard")
def get_margins():
    return broker.get_margins()

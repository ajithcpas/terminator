import os

import requests
from ks_api_client import ks_api, ApiException

from broker.base_broker import Broker


class KotakBroker(Broker):
    def __init__(self):
        super().__init__()
        self.kotak_api = None
        self.init_api()

    def init_api(self):
        if self.kotak_api is not None:
            return

        access_token = os.environ.get('KOTAK_ACCESS_TOKEN')
        user_id = os.environ.get('KOTAK_USER_ID')
        consumer_key = os.environ.get('KOTAK_CONSUMER_KEY')
        app_id = os.environ.get('KOTAK_APP_ID')
        host = os.environ.get('KOTAK_HOST')
        client = ks_api.KSTradeApi(access_token=access_token, userid=user_id, consumer_key=consumer_key, ip="127.0.0.1",
                                   app_id=app_id, host=host)

        client.login(password=os.environ.get('KOTAK_PASSWORD'))
        client.session_2fa(access_code=os.environ.get('KOTAK_ACCESS_CODE'))
        self.kotak_api = client

    def get_available_funds(self):
        pass

    def place_order(self, order):
        try:
            response = self.kotak_api.place_order(order_type="N", instrument_token=order["instrumentToken"],
                                                  transaction_type=order["order"],
                                                  quantity=order["qty"], price=order["price"], disclosed_quantity=0,
                                                  trigger_price=order["triggerPrice"],
                                                  validity="GFD", variety="REGULAR", tag="string")
            self.logger.info(f"Order placed:: {response}")
            return response
        except ApiException as apiEx:
            self.logger.error(apiEx)
            return apiEx.body

    def modify_order(self, order):
        try:
            response = self.kotak_api.modify_order(order_id=order["orderId"], quantity=order["qty"],
                                                   price=order["price"], disclosed_quantity=0,
                                                   trigger_price=order["triggerPrice"], validity="GFD")
            self.logger.info(f"Order modified:: {response}")
            return response
        except ApiException as apiEx:
            self.logger.error(apiEx)
            return apiEx.body

    def cancel_order(self, order):
        try:
            response = self.kotak_api.cancel_order(order_id=order["orderId"])
            self.logger.info(f"Order cancelled:: {response}")
            return response
        except ApiException as apiEx:
            self.logger.error(apiEx)
            return apiEx.body

    def get_open_position_count(self):
        pass

    def get_watchlists(self):
        url = os.environ.get('KOTAK_HOST') + '/watchlist/2.0/watchlists'
        headers = {'authorization': 'Bearer ' + os.environ.get('KOTAK_ACCESS_TOKEN'),
                   'userid': os.environ.get('KOTAK_USER_ID'),
                   'consumerKey': os.environ.get('KOTAK_CONSUMER_KEY')
                   }
        response = requests.get(url, headers=headers)
        return response.json()

    def get_watchlist_by_name(self, name):
        url = os.environ.get('KOTAK_HOST') + f'/watchlist/2.0/watchlists/byName/{name}'
        headers = {'authorization': 'Bearer ' + os.environ.get('KOTAK_ACCESS_TOKEN'),
                   'userid': os.environ.get('KOTAK_USER_ID'),
                   'consumerKey': os.environ.get('KOTAK_CONSUMER_KEY')
                   }
        response = requests.get(url, headers=headers)
        return response.json()

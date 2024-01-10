import base64
import os
import threading
from datetime import datetime
from urllib.error import HTTPError

import requests
import socketio
from ks_api_client import ks_api, ApiException

from broker.base_broker import Broker


class KotakBroker(Broker):
    def __init__(self):
        super().__init__()
        self.kotak_api = None
        self.kotak_ws = None
        self.headers = None
        self.init_api()
        self.start_ticker()
        self.socketio = None

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

        self.headers = {'authorization': 'Bearer ' + self.kotak_api.access_token,
                        'userid': self.kotak_api.userid,
                        'consumerKey': self.kotak_api.consumer_key,
                        'sessionToken': self.kotak_api.session_token
                        }

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

    def get_watchlists(self):
        url = self.kotak_api.host + '/watchlist/2.1/watchlists'
        return requests.get(url, headers=self.headers).json()

    def get_watchlists_by_name(self, name):
        url = self.kotak_api.host + f'/watchlist/2.1/watchlists/byName/{name}'
        return requests.get(url, headers=self.headers).json()

    def get_margins(self):
        url = self.kotak_api.host + '/margin/1.0/margin'
        response = requests.get(url, headers=self.headers)
        return response.json()

    def get_orders(self):
        orders = self.kotak_api.order_report()
        for order in orders["success"]:
            from_datetime = datetime.strptime(order["orderTimestamp"], "%b %d %Y %I:%M:%S:%f%p")
            to_datetime = from_datetime.strftime("%H:%M:%S")
            order["orderTimestamp"] = to_datetime
        return orders

    def get_positions(self):
        open_positions = self.kotak_api.positions("OPEN")
        today_positions = self.kotak_api.positions("TODAYS")
        return {"open": open_positions["Success"], "todays": today_positions["Success"]}

    def start_ticker(self):
        consumer_key = os.environ.get('KOTAK_CONSUMER_KEY')
        consumer_secret = os.environ.get('KOTAK_CONSUMER_SECRET')

        AUTH = f"{consumer_key}:{consumer_secret}"
        TOKEN_API = "https://wstreamer.kotaksecurities.com/feed/auth/token"

        try:
            # Generating base64 encoding of consumer credentials
            AUTH_BASE64 = base64.b64encode(AUTH.encode("UTF-8"))
            PAYLOAD = {"authentication": AUTH_BASE64.decode("UTF-8")}
            # Getting access token
            response = requests.post(url=TOKEN_API, data=PAYLOAD)
            json_response = response.json()

            # Check if we got access token
            if json_response["result"]["token"] is None:
                self.logger.error("Token not found")
                exit(-1)
            else:
                sio = socketio.Client(
                    reconnection=True, request_timeout=20, reconnection_attempts=5, engineio_logger=True, logger=True)
                self.kotak_ws = sio

                def set_interval(func, time):
                    e = threading.Event()
                    while not e.wait(time):
                        func()

                def foo():
                    sio.emit("handshake", {"inputtoken": "Hello World!"})

                @sio.event
                def connect():
                    self.logger.info("connection success")
                    # sio.emit("pageload", {"inputtoken": "38969,35513"})
                    sio.emit("pageload", {"inputtoken": ""})
                    set_interval(foo, 5)

                @sio.event
                def connect_error():
                    self.logger.info("connection failed")

                @sio.event
                def disconnect():
                    self.logger.info("connection closed")

                @sio.on("broadcast")
                def on_broadcast(msg):
                    self.logger.info(f"broadcast: {msg}")

                @sio.on("message")
                def on_message(msg):
                    self.logger.info(f"message: {msg}")

                @sio.on("getdata")
                def on_get_data(data):
                    self.logger.info(f"price: {data}")
                    self.socketio.emit("ticker", data)

                # Do the connection using above access token
                sio.connect("https://wstreamer.kotaksecurities.com",
                            headers={"Authorization": "Bearer " + json_response["result"]["token"]},
                            transports=["websocket"], socketio_path="/feed")
                # sio.wait()

        except HTTPError as http_err:
            self.logger.error(f"HTTP error occurred: {http_err}")
        except Exception as err:
            self.logger.error(f"Other error occurred: {err}")

    def get_live_ticks(self, instrument_tokens):
        self.logger.info(f"ticker tokens :: {instrument_tokens} {type(instrument_tokens)}")
        input_token = ",".join([str(element) for element in instrument_tokens])
        self.kotak_ws.emit("pageload", {"inputtoken": input_token})

    def set_server_socketio(self, server_socketio):
        self.socketio = server_socketio

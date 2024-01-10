import base64
import os
import threading

import requests
import socketio
from flask.cli import load_dotenv
from requests.exceptions import HTTPError

load_dotenv('.env')
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
    jsonResponse = response.json()

    # Check if we got access token
    if jsonResponse['result']['token'] is None:
        print('Token not found')
    else:
        sio = socketio.Client(
            reconnection=True, request_timeout=20, reconnection_attempts=5, engineio_logger=True, logger=True)


        def setInterval(func, time):
            e = threading.Event()
            while not e.wait(time):
                func()


        def foo():
            sio.emit('handshake', {'inputtoken': 'Hello World!'})


        @sio.event
        def connect():
            print('connection success')
            # sio.emit('pageload', {'inputtoken': '38969,35513'})
            sio.emit('pageload', {'inputtoken': '24049,24050'})
            setInterval(foo, 5)


        @sio.event
        def connect_error():
            print("connection failed")


        @sio.event
        def disconnect():
            print('connection closed')


        @sio.on('broadcast')
        def on_broadcast(msg):
            print('broadcast: ', msg)


        @sio.on('message')
        def on_message(msg):
            print('message: ', msg)


        @sio.on('getdata')
        def on_getdata(data):
            print('price: ', data)


        # Do the connection using above access token
        sio.connect('https://wstreamer.kotaksecurities.com',
                    headers={'Authorization': 'Bearer ' + jsonResponse['result']['token']},
                    transports=["websocket"], socketio_path='/feed')
        sio.wait()

except HTTPError as http_err:
    print(f'HTTP error occurred: {http_err}')
except Exception as err:
    print(f'Other error occurred: {err}')

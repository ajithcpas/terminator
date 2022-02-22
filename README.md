# Terminator

- Slick & fast trading terminal for Indian markets.
- Supports Kotak Securities API.

## Features

- **Quick order types:** It ensures the order will be executed within, say, 15 sec. Pending order price will be modified
  automatically for every 5 sec until it gets executed. If it's not executed after 2 tries then order will be modified
  to market order. Below are the types supported:
    - LM (Limit Market) - Places limit order and converted to market order if max try exceeds.
    - SL (Stoploss Limit) - Places stoploss limit order and converted to market order if max try exceeds.

- Supports auto order slicing, grouping and managing it efficiently from UI.
- Sticky order window helps to avoid reopening order window each time.
- Use only for execution. Charting is not supported.

## Development Environment

- Python 3.9.1
- pipenv 2022.1.8

import abc
import logging


class Broker(metaclass=abc.ABCMeta):
    logger = logging.getLogger(__name__)

    def __init__(self):
        pass

    @abc.abstractmethod
    def place_order(self, order):
        pass

    @abc.abstractmethod
    def modify_order(self, order):
        pass

    @abc.abstractmethod
    def cancel_order(self, order):
        pass

    @abc.abstractmethod
    def get_margins(self):
        pass

    @abc.abstractmethod
    def get_watchlists(self):
        pass

    @abc.abstractmethod
    def get_orders(self):
        pass

    @abc.abstractmethod
    def get_positions(self):
        pass

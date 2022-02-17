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
    def get_open_position_count(self):
        pass

    @abc.abstractmethod
    def get_available_funds(self):
        pass

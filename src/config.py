class Config(object):
    pass


class DevelopmentConfig(Config):
    TESTING = False
    ENV = "development"
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
    ENV = "testing"


class ProductionConfig(Config):
    TESTING = False
    ENV = "production"

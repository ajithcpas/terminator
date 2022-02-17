import os

from flask import Flask
from flask.cli import load_dotenv
from waitress import serve

from config import DevelopmentConfig, TestingConfig, ProductionConfig


def create_app():
    static_folder = os.path.join(os.getcwd(), "web")
    app = Flask(__name__, static_url_path="/", static_folder=static_folder)

    app_env = os.environ.get("APP_ENV")
    if app_env == "development":
        app.config.from_object(DevelopmentConfig)
    elif app_env == "testing":
        app.config.from_object(TestingConfig)
    else:
        app.config.from_object(ProductionConfig)

    register_extensions(app)
    register_blueprints(app)
    return app


def register_extensions(app):
    app.config["SECRET_KEY"] = os.environ.get("APP_SECRET_KEY")
    from extensions import bcrypt
    bcrypt.init_app(app)


def register_blueprints(app):
    from controller.index import index_bp, api_bp
    app.register_blueprint(index_bp)
    app.register_blueprint(api_bp)


if __name__ == "__main__":
    load_dotenv('.env')
    app_server = create_app()
    if os.environ.get("APP_ENV") == "development":
        app_server.run(host=os.environ.get("APP_HOST"), port=os.environ.get("APP_PORT"),
                       debug=os.environ.get("APP_DEBUG"))
    else:
        with app_server.app_context():
            serve(app_server)

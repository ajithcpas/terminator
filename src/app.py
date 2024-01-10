import os

from flask import Flask
from flask.cli import load_dotenv
from waitress import serve

from config import DevelopmentConfig, TestingConfig, ProductionConfig


def create_app():
    from extensions import ROOT_DIR
    static_folder = os.path.join(ROOT_DIR, "web")
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
    # from extensions import bcrypt, socketio
    bcrypt.init_app(app)
    app_env = os.environ.get("APP_ENV")
    # if app_env == "development":
    #     socketio.init_app(app, cors_allowed_origins="*")
    # else:
    #     socketio.init_app(app)


def register_blueprints(app):
    from controller.index import index_bp, api_bp
    app.register_blueprint(index_bp)
    app.register_blueprint(api_bp)


if __name__ == "__main__":
    load_dotenv('.env')
    app_server = create_app()
    app_server.run(host=os.environ.get("APP_HOST"), port=os.environ.get("APP_PORT"),
                       debug=os.environ.get("APP_DEBUG"))

    # from extensions import socketio
    #
    # if os.environ.get("APP_ENV") == "development":
    #     # app_server.run(host=os.environ.get("APP_HOST"), port=os.environ.get("APP_PORT"),
    #     #                debug=os.environ.get("APP_DEBUG"))
    #     socketio.run(app_server, host=os.environ.get("APP_HOST"), port=int(os.environ.get("APP_PORT")))
    #
    # else:
    #     with app_server.app_context():
    #         # serve(app_server)
    #         socketio.run(app_server, host=os.environ.get("APP_HOST"), port=int(os.environ.get("APP_PORT")))

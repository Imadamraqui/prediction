from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    from .routes.auth import auth_bp
    from .routes.prediction import prediction_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(prediction_bp, url_prefix="/predict")

    return app

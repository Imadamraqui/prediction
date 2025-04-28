from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    from app.routes.prediction import prediction_bp
    app.register_blueprint(prediction_bp)

    return app

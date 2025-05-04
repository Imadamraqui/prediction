from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    from app.routes.prediction import prediction_bp
    from app.routes.auth import auth_bp

    app.register_blueprint(prediction_bp)
    app.register_blueprint(auth_bp)

    # Ajoute ce bloc pour voir les routes disponibles
    print("📌 Routes enregistrées :")
    for rule in app.url_map.iter_rules():
        print(rule)

    return app

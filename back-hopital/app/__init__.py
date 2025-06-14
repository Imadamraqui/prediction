from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.routes.chatbot import chatbot_bp
import logging

jwt = JWTManager()
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configuration du logging
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger(__name__)

    # Configuration
    app.config['JWT_SECRET_KEY'] = 'votre_cle_secrete_jwt'  # À changer en production
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/hopital'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = True  # Affiche les requêtes SQL

    # Initialisation des extensions
    jwt.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)

    # Importation explicite des classes de modèles pour s'assurer qu'elles sont enregistrées avec SQLAlchemy
    from app.models.patient import Patient
    from app.models.departement import Departement
    from app.models.prediction import Prediction
    from app.models.medecin import Medecin

    # Test de la connexion à la base de données
    with app.app_context():
        try:
            db.engine.connect()
            logger.info("Connexion à la base de données réussie!")
        except Exception as e:
            logger.error(f"Erreur de connexion à la base de données: {str(e)}")

    # Enregistrement des blueprints
    print("Loading blueprints...")  # Debug print
    from app.routes.auth import auth_bp
    from app.routes.patient import patient_bp
    from app.routes.departements import departements_bp
    from app.routes.prediction import prediction_bp
    from app.routes.predictions import predictions_bp
    from app.routes.medecins import medecins_bp
    from app.routes.stats import stats_bp

    print("Registering blueprints...")  # Debug print
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(patient_bp, url_prefix='/api/patient')
    app.register_blueprint(departements_bp, url_prefix='/api/departements')
    app.register_blueprint(prediction_bp, url_prefix='/api/prediction')
    app.register_blueprint(predictions_bp, url_prefix='/api/predictions')
    app.register_blueprint(medecins_bp, url_prefix='/api')
    app.register_blueprint(chatbot_bp)
    app.register_blueprint(stats_bp)  # Le préfixe est déjà défini dans le blueprint
    print("Blueprints registered!")  # Debug print

    # Liste toutes les routes disponibles pour debug
    print("\nRegistered routes:")  # Debug print
    for rule in app.url_map.iter_rules():
        print(f"[ROUTE] {rule.endpoint} → {rule}")

    return app

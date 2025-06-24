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
    
    # ✅ Configuration CORS (placer ici, après avoir créé `app`)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    # 🔧 Logging
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger(__name__)

    # 🔧 Configuration Flask
    app.config['JWT_SECRET_KEY'] = 'votre_cle_secrete_jwt'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/hopital'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = True

    # 🔧 Initialisation extensions
    jwt.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)

    # 🔧 Import explicite modèles
    from app.models.patient import Patient
    from app.models.departement import Departement
    from app.models.prediction import Prediction
    from app.models.medecin import Medecin

    # ✅ Test DB
    with app.app_context():
        try:
            db.engine.connect()
            logger.info("Connexion à la base de données réussie!")
        except Exception as e:
            logger.error(f"Erreur de connexion à la base de données: {str(e)}")

    # ✅ Enregistrement des blueprints
    from app.routes.auth import auth_bp
    from app.routes.patient import patient_bp
    from app.routes.departements import departements_bp
    from app.routes.prediction import prediction_bp
    from app.routes.predictions import predictions_bp
    from app.routes.medecins import medecins_bp
    from app.routes.stats import stats_bp
    from app.routes.historique_pdf import historique_pdf_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(patient_bp, url_prefix='/api/patient')
    app.register_blueprint(departements_bp, url_prefix='/api/departements')
    app.register_blueprint(prediction_bp, url_prefix='/api/prediction')
    app.register_blueprint(predictions_bp, url_prefix='/api/predictions')
    app.register_blueprint(medecins_bp, url_prefix='/api')
    app.register_blueprint(chatbot_bp)
    app.register_blueprint(stats_bp)
    app.register_blueprint(historique_pdf_bp)

    # ✅ Debug: liste des routes
    print("\nRegistered routes:")
    for rule in app.url_map.iter_rules():
        print(f"[ROUTE] {rule.endpoint} → {rule}")

    return app

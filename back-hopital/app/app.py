from flask import Flask
from app.routes.medecins import medecins_bp
from app.routes.predictions import predictions_bp

app = Flask(__name__)

# ... existing code ...

app.register_blueprint(medecins_bp, url_prefix='/api/medecins')
app.register_blueprint(predictions_bp, url_prefix='/api/predictions')

# ... existing code ...
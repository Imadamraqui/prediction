from flask import Blueprint, jsonify
from app.models.prediction import Prediction
from app.models.departement import Departement
from app.models.medecin import Medecin
from app import db
from sqlalchemy import func
from datetime import datetime, timedelta
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging

logger = logging.getLogger(__name__)
print("Loading stats routes...")  # Debug print

stats_bp = Blueprint('stats', __name__, url_prefix='/api/stats')

@stats_bp.route('/predictions/history', methods=['GET'])
@jwt_required()
def get_prediction_history():
    try:
        # Récupérer l'ID du patient connecté
        current_user_id = get_jwt_identity()
        logger.debug(f"Récupération de l'historique pour le patient ID: {current_user_id}")

        # Récupérer les prédictions des 30 derniers jours pour ce patient
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
        predictions = db.session.query(
            Prediction.date_prediction,
            Prediction.prediction,
            Prediction.probabilities,
            Prediction.recommendations,
            Departement.nom_depart.label('departement')
        ).join(
            Departement, Prediction.departement_id == Departement.id
        ).filter(
            Prediction.patient_id == current_user_id,
            Prediction.date_prediction >= thirty_days_ago
        ).order_by(
            Prediction.date_prediction.desc()
        ).all()
        
        return jsonify([{
            'date': pred.date_prediction.strftime('%Y-%m-%d %H:%M:%S'),
            'result': pred.prediction,
            'probabilities': pred.probabilities,
            'recommendations': pred.recommendations,
            'departement': pred.departement
        } for pred in predictions])
    except Exception as e:
        logger.error(f"Erreur lors de la récupération de l'historique: {str(e)}")
        return jsonify({"error": str(e)}), 500

@stats_bp.route('/medecins', methods=['GET'])
@jwt_required()
def get_medecin_stats():
    try:
        # Récupérer l'ID du patient connecté
        current_user_id = get_jwt_identity()
        logger.debug(f"Récupération des stats médecins pour le patient ID: {current_user_id}")

        # Statistiques par médecin pour ce patient
        medecin_stats = db.session.query(
            Medecin.nom.label('medecin_name'),
            func.count(Prediction.id).label('total_predictions')
        ).join(
            Prediction, Prediction.medecin_id == Medecin.id
        ).filter(
            Prediction.patient_id == current_user_id
        ).group_by(
            Medecin.nom
        ).all()
        
        return jsonify([{
            'medecin': stat.medecin_name,
            'total_predictions': stat.total_predictions
        } for stat in medecin_stats])
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des stats médecins: {str(e)}")
        return jsonify({"error": str(e)}), 500

@stats_bp.route('/departements', methods=['GET'])
@jwt_required()
def get_departement_stats():
    try:
        # Récupérer l'ID du patient connecté
        current_user_id = get_jwt_identity()
        logger.debug(f"Récupération des stats départements pour le patient ID: {current_user_id}")

        # Statistiques par département pour ce patient
        departement_stats = db.session.query(
            Departement.nom_depart.label('departement_name'),
            func.count(Prediction.id).label('total_predictions')
        ).join(
            Prediction, Prediction.departement_id == Departement.id
        ).filter(
            Prediction.patient_id == current_user_id
        ).group_by(
            Departement.nom_depart
        ).all()
        
        return jsonify([{
            'departement': stat.departement_name,
            'total_predictions': stat.total_predictions
        } for stat in departement_stats])
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des stats départements: {str(e)}")
        return jsonify({"error": str(e)}), 500 
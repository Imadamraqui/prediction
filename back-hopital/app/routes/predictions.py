from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.database import get_db_connection
import pymysql.cursors
import logging

logger = logging.getLogger(__name__)
predictions_bp = Blueprint('predictions', __name__)

@predictions_bp.route('/history', methods=['GET'])
@jwt_required()
def get_prediction_history():
    try:
        # Récupérer l'ID du patient à partir du token JWT
        current_user_id = get_jwt_identity()
        logger.debug(f"Current user ID: {current_user_id}")
        
        # Connexion à la base de données
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # Convertir l'ID en entier pour la requête SQL
        user_id = int(current_user_id)

        # Récupérer l'historique des prédictions du patient
        cursor.execute("""
            SELECT p.*, d.nom_depart, d.description 
            FROM predictions p
            JOIN departement d ON p.departement_id = d.id
            WHERE p.patient_id = %s
            ORDER BY p.date_prediction DESC
        """, (user_id,))
        predictions = cursor.fetchall()

        # Formater les prédictions pour la réponse
        predictions_data = []
        for pred in predictions:
            predictions_data.append({
                'id': pred['id'],
                'prediction': pred['prediction'],
                'probabilities': pred['probabilities'],
                'recommendations': pred['recommendations'],
                'departement': {
                    'id': pred['departement_id'],
                    'nom_depart': pred['nom_depart'],
                    'description': pred['description']
                },
                'date_prediction': pred['date_prediction'].isoformat()
            })

        cursor.close()
        conn.close()

        return jsonify(predictions_data), 200

    except Exception as e:
        logger.error(f"Error in get_prediction_history: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500 
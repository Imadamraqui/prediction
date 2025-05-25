from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.database import get_db_connection

predictions_bp = Blueprint('predictions', __name__)

@predictions_bp.route('/history', methods=['GET'])
@jwt_required()
def get_prediction_history():
    try:
        # Récupérer l'ID du patient à partir du token JWT
        current_user_id = get_jwt_identity()
        
        # Connexion à la base de données
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Vérifier si l'utilisateur est un patient
        cursor.execute("SELECT id FROM patients WHERE user_id = %s", (current_user_id,))
        patient = cursor.fetchone()
        if not patient:
            return jsonify({'error': 'Accès non autorisé'}), 403

        # Récupérer l'historique des prédictions du patient
        cursor.execute("""
            SELECT p.*, d.nom_depart, d.description 
            FROM predictions p
            JOIN departement d ON p.departement_id = d.id
            WHERE p.patient_id = %s
            ORDER BY p.date_prediction DESC
        """, (patient['id'],))
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
        return jsonify({'error': str(e)}), 500 
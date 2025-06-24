from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.database import get_db_connection
import logging
import pymysql.cursors
import datetime

logger = logging.getLogger(__name__)
patient_bp = Blueprint('patient', __name__)

@patient_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        logger.debug(f"Request headers: {dict(request.headers)}")
        
        current_user_id = get_jwt_identity()
        logger.debug(f"Current user ID: {current_user_id}")
        
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        user_id = int(current_user_id)
        cursor.execute(
            "SELECT id, nom, email, date_naissance, sexe FROM patients WHERE id = %s",
            (user_id,)
        )
        patient = cursor.fetchone()

        cursor.close()
        conn.close()

        if not patient:
            return jsonify({'error': 'Patient non trouvé'}), 404

        # 🔧 Conversion explicite de la date pour éviter erreur de sérialisation
        if isinstance(patient["date_naissance"], (datetime.date, datetime.datetime)):
            patient["date_naissance"] = patient["date_naissance"].strftime("%Y-%m-%d")

        return jsonify(patient), 200

    except Exception as e:
        logger.error(f"Error in get_profile: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

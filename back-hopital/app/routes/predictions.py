from flask import Blueprint, jsonify, request, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.database import get_db_connection
import pymysql.cursors
import logging
import io
from fpdf import FPDF
from flask_cors import cross_origin

logger = logging.getLogger(__name__)
predictions_bp = Blueprint('predictions', __name__)

# Route : Historique des prédictions
@predictions_bp.route('/history', methods=['GET'])
@jwt_required()
def get_prediction_history():
    try:
        user_id = int(get_jwt_identity())
        logger.debug(f"Current user ID: {user_id}")

        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        cursor.execute("""
            SELECT p.*, d.nom_depart, d.description 
            FROM predictions p
            JOIN departement d ON p.departement_id = d.id
            WHERE p.patient_id = %s
            ORDER BY p.date_prediction DESC
        """, (user_id,))
        predictions = cursor.fetchall()

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


# Route : Téléchargement PDF pour une prédiction donnée
@predictions_bp.route('/<int:prediction_id>/rapport-pdf', methods=['GET'])
@cross_origin()
@jwt_required()
def rapport_pdf(prediction_id):
    try:
        user_id = int(get_jwt_identity())

        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # Infos du patient
        cursor.execute("SELECT nom, email FROM patients WHERE id = %s", (user_id,))
        patient = cursor.fetchone()
        if not patient:
            cursor.close()
            conn.close()
            return jsonify({"error": "Patient introuvable"}), 404

        # Infos de la prédiction
        cursor.execute("""
            SELECT p.prediction, d.nom_depart AS departement, p.date_prediction
            FROM predictions p
            JOIN departement d ON p.departement_id = d.id
            WHERE p.id = %s AND p.patient_id = %s
        """, (prediction_id, user_id))
        prediction = cursor.fetchone()

        cursor.close()
        conn.close()

        if not prediction:
            return jsonify({"error": "Prédiction introuvable"}), 404

        # Génération du PDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", "B", 16)
        pdf.cell(0, 10, "Rapport de Prédiction Médicale", ln=True, align="C")

        pdf.ln(10)
        pdf.set_font("Arial", "", 12)
        pdf.cell(0, 10, f"Nom du patient : {patient['nom']}", ln=True)
        pdf.cell(0, 10, f"Email : {patient['email']}", ln=True)
        pdf.cell(0, 10, f"Date de prédiction : {prediction['date_prediction']}", ln=True)
        pdf.cell(0, 10, f"Maladie prédite : {prediction['prediction']}", ln=True)
        pdf.cell(0, 10, f"Département suggéré : {prediction['departement']}", ln=True)

        pdf_bytes = pdf.output(dest='S').encode('latin1')
        return send_file(io.BytesIO(pdf_bytes),
                         mimetype='application/pdf',
                         download_name=f'prediction_{prediction_id}.pdf',
                         as_attachment=True)

    except Exception as e:
        logger.error(f"Erreur génération PDF : {str(e)}", exc_info=True)
        return jsonify({"error": "Erreur lors de la génération du PDF"}), 500

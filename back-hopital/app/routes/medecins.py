from flask import Blueprint, jsonify, request
from app.models.database import get_db_connection  # importe ta fonction existante
from flask_cors import cross_origin
import pymysql.cursors
import smtplib
from email.mime.text import MIMEText

medecins_bp = Blueprint('medecins', __name__)

@medecins_bp.route('/medecins', methods=['GET'])
@cross_origin()
def get_medecins():
    connection = get_db_connection()
    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT id, nom, email, grade, photo_url, specialite FROM medecins")
            medecins = cursor.fetchall()
        return jsonify(medecins)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@medecins_bp.route('/medecins/<int:id>', methods=['GET'])
@cross_origin()
def get_medecin(id):
    connection = get_db_connection()
    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT id, nom, email, grade, photo_url, specialite FROM medecins WHERE id = %s", (id,))
            medecin = cursor.fetchone()
        if medecin:
            return jsonify(medecin)
        return jsonify({"error": "Médecin introuvable"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@medecins_bp.route('/contact-medecin', methods=['POST', 'OPTIONS'])
@cross_origin(origins="http://localhost:3000", allow_headers=["Content-Type"], methods=["POST", "OPTIONS"])
def contact_medecin():
    if request.method == "OPTIONS":
        # Répondre OK pour la requête preflight CORS
        response = jsonify({'ok': True})
        response.status_code = 200
        return response
    data = request.json
    medecin_email = data.get("medecinEmail")
    message = data.get("message")
    if not medecin_email or not message:
        return jsonify({"error": "Champs manquants"}), 400

    try:
        # Configure ton serveur SMTP ici
        smtp_host = "smtp.example.com"
        smtp_port = 587
        smtp_user = "ton_email@example.com"
        smtp_pass = "ton_mot_de_passe"

        msg = MIMEText(message)
        msg["Subject"] = "Nouveau message d'un patient"
        msg["From"] = smtp_user
        msg["To"] = medecin_email

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, [medecin_email], msg.as_string())

        return jsonify({"ok": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

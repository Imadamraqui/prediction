from flask import Blueprint, jsonify
from app.models.database import get_db_connection  # importe ta fonction existante
from flask_cors import cross_origin
import pymysql.cursors

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

from flask import Blueprint, jsonify
from app.models.database import get_db_connection
from flask_cors import cross_origin
import pymysql.cursors

departements_bp = Blueprint('departements', __name__)

@departements_bp.route('/departements', methods=['GET'])
@cross_origin()
def get_departements():
    connection = get_db_connection()
    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT id, nom_depart, description, classe_pred FROM departement")
            departements = cursor.fetchall()
        return jsonify(departements)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@departements_bp.route('/departements/<int:id>', methods=['GET'])
@cross_origin()
def get_departement(id):
    connection = get_db_connection()
    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT id, nom_depart, description, classe_pred FROM departement WHERE id = %s", (id,))
            departement = cursor.fetchone()
        if departement:
            return jsonify(departement)
        return jsonify({"error": "Département introuvable"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close() 
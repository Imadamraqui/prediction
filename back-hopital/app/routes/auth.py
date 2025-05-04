from flask import Blueprint, request, jsonify
from app.models.database import get_db_connection
import jwt as pyjwt
import datetime
import traceback



auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

SECRET_KEY = 'votre_cle_secrete'  # À stocker dans une vraie config

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('mot_de_passe'):
        return jsonify({'message': 'Email et mot de passe requis.'}), 400

    email = data['email']
    mot_de_passe = data['mot_de_passe']

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, mot_de_passe FROM patients WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user:
            return jsonify({'message': 'Utilisateur non trouvé.'}), 404

        user_id, stored_password = user

        if stored_password != mot_de_passe:
            return jsonify({'message': 'Mot de passe incorrect.'}), 401

        token = pyjwt.encode({
            'id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({'token': token, 'message': 'Connexion réussie.'}), 200

    except Exception as e:
        print("Erreur attrapée :", traceback.format_exc())
        return jsonify({'message': f'Erreur serveur : {str(e)}'}), 500



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


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    required_fields = ['nom', 'email', 'mot_de_passe', 'date_naissance', 'sexe']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Tous les champs sont requis.'}), 400

    nom = data['nom']
    email = data['email']
    mot_de_passe = data['mot_de_passe']
    date_naissance = data['date_naissance']
    sexe = data['sexe']
    date_creation = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Vérifie si l'utilisateur existe déjà
        cursor.execute("SELECT id FROM patients WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'message': 'Un utilisateur avec cet email existe déjà.'}), 409

        # Insère le nouvel utilisateur
        cursor.execute("""
            INSERT INTO patients (nom, email, mot_de_passe, date_naissance, sexe, date_creation)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (nom, email, mot_de_passe, date_naissance, sexe, date_creation))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Inscription réussie.'}), 201

    except Exception as e:
        print("Erreur attrapée :", traceback.format_exc())
        return jsonify({'message': f'Erreur serveur : {str(e)}'}), 500

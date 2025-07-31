from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
import pandas as pd
import pickle
import os
import pdfplumber
import numpy as np
import re 
import pymysql
from app.models.database import get_db_connection
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
import logging
import io
from fpdf import FPDF

logger = logging.getLogger(__name__)
prediction_bp = Blueprint('prediction', __name__)

# Charger le modèle et l'encodeur
model_path = os.path.join(os.path.dirname(__file__), '../models/xgb_model.pkl')
encoder_path = os.path.join(os.path.dirname(__file__), '../models/label_encoder.pkl')

try:
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    with open(encoder_path, 'rb') as f:
        label_encoder = pickle.load(f)
except Exception as e:
    print(f"Erreur lors du chargement du modèle : {str(e)}")
    model = None
    label_encoder = None 

# Classes de maladies
HEALTH_CLASSES = {
    "0": "Diabetes",
    "1": "Heart Di",
    "2": "Healthy",
    "3": "Thalasse",
    "4": "Anemia",
    "5": "Thromboc"
}

def get_recommendations(prediction):
    recommendations = {
        "Diabetes": [
            "Surveillez votre glycémie régulièrement",
            "Maintenez une alimentation équilibrée",
            "Faites de l'exercice régulièrement",
            "Consultez un diabétologue"
        ],
        "Heart Di": [
            "Surveillez votre tension artérielle",
            "Évitez les aliments riches en sel",
            "Faites de l'exercice modéré",
            "Consultez un cardiologue"
        ],
        "Healthy": [
            "Continuez à maintenir un mode de vie sain",
            "Faites des bilans réguliers",
            "Maintenez une alimentation équilibrée",
            "Faites de l'exercice régulièrement"
        ],
        "Thalasse": [
            "Consultez un hématologue",
            "Surveillez votre taux de fer",
            "Évitez les carences en vitamines",
            "Faites des bilans sanguins réguliers"
        ],
        "Anemia": [
            "Augmentez votre consommation de fer",
            "Prenez des suppléments si prescrits",
            "Surveillez votre alimentation",
            "Consultez un médecin pour un suivi"
        ],
        "Thromboc": [
            "Surveillez votre numération plaquettaire",
            "Évitez les activités à risque de saignement",
            "Consultez un hématologue",
            "Faites des bilans sanguins réguliers"
        ]
    }
    return recommendations.get(prediction, ["Consultez un professionnel de santé"])

def get_medecins_and_departement(prediction):
    # Mapping des prédictions vers les IDs de départements
    departement_mapping = {
        "Diabetes": 1,  # Endocrinologie et Diabétologie
        "Heart Di": 2,  # Cardiologie
        "Thalasse": 4,  # Thalassémie
        "Anemia": 5,    # Hématologie
        "Thromboc": 6   # Thrombocytopathies
    }
    
    try:
        connection = get_db_connection()
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Obtenir le département
            departement_id = departement_mapping.get(prediction)
            logger.debug(f"Recherche du département avec l'ID: {departement_id}")
            
            if departement_id:
                # Requête pour le département
                cursor.execute("""
                    SELECT id, nom_depart, description 
                    FROM departement 
                    WHERE id = %s
                """, (departement_id,))
                departement = cursor.fetchone()
                logger.debug(f"Département trouvé: {departement}")

                if departement:
                    # Requête pour les médecins
                    cursor.execute("""
                        SELECT id, nom, grade, specialite, photo_url 
                        FROM medecins 
                        WHERE departement_id = %s 
                        LIMIT 3
                    """, (departement_id,))
                    medecins = cursor.fetchall()
                    logger.debug(f"Médecins trouvés: {medecins}")

                    return {
                        "departement": departement,
                        "medecins": medecins
                    }
                else:
                    logger.warning(f"Aucun département trouvé pour l'ID: {departement_id}")
                    return None
            else:
                logger.warning(f"Aucun mapping trouvé pour la prédiction: {prediction}")
                return None
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des médecins et du département : {str(e)}")
        return None
    finally:
        connection.close()

def extract_table_from_pdf(pdf_file):
    """
    Extrait les données tabulaires verticales depuis un PDF sans bordures.
    Le format attendu est : 'Attribut         Valeur'
    """
    try:
        with pdfplumber.open(pdf_file) as pdf:
            text = pdf.pages[0].extract_text()

            if not text:
                raise ValueError("Aucun texte détecté dans le PDF")

            lines = text.split('\n')
            values = {}

            for line in lines:
                # Ignorer l'entête, pied de page ou titre
                if ":" in line or "|" in line or "Page" in line:
                    continue

                # Séparer l'attribut de la valeur en détectant la dernière séquence numérique
                match = re.search(r"(.+?)\s+([-+]?\d*\.?\d+)$", line)
                if match:
                    key = match.group(1).strip()
                    val = match.group(2).strip()
                    try:
                        values[key] = float(val)
                    except ValueError:
                        continue  # ignorer si ce n'est pas un float

            if not values:
                raise ValueError("Aucune donnée numérique extraite")

            df = pd.DataFrame([values])
            print("✅ Extraction réussie depuis le PDF vertical.")
            return df

    except Exception as e:
        raise Exception(f"Erreur lors de l'extraction du PDF: {str(e)}")



@prediction_bp.route('/ping', methods=['POST'])
def ping():
    return jsonify({"message": "pong"})

@prediction_bp.route('/analyze', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier n\'a été envoyé'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Aucun fichier sélectionné'}), 400

    try:
        if file.filename.lower().endswith('.pdf'):
            # Extraire les données depuis le PDF
            df = extract_table_from_pdf(file)
        else:
            # Lire le fichier CSV
            df = pd.read_csv(file)

        # Vérifier les colonnes requises
        required_columns = [
            'Glucose', 'Cholesterol', 'Hemoglobin', 'Platelets',
            'White Blood Cells', 'Red Blood Cells', 'Hematocrit',
            'Mean Corpuscular Volume', 'Mean Corpuscular Hemoglobin',
            'Mean Corpuscular Hemoglobin Concentration', 'Insulin', 'BMI',
            'Systolic Blood Pressure', 'Diastolic Blood Pressure', 'Triglycerides',
            'HbA1c', 'LDL Cholesterol', 'HDL Cholesterol', 'ALT', 'AST',
            'Heart Rate', 'Creatinine', 'Troponin', 'C-reactive Protein'
        ]
        
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return jsonify({'error': f'Colonnes manquantes : {", ".join(missing_columns)}'}), 400

        # Faire la prédiction et obtenir les probabilités
        X = df[required_columns]
        prediction = model.predict(X)
        prediction_proba = model.predict_proba(X)[0]
        
        # S'assurer que les probabilités sont normalisées (somme = 1)
        prediction_proba = prediction_proba / prediction_proba.sum()
        
        # Obtenir la classe prédite
        prediction_label = label_encoder.inverse_transform(prediction)[0]
        
        # Créer un dictionnaire des probabilités pour chaque classe
        probabilities = {
            HEALTH_CLASSES[str(i)]: float(proba) * 100  # Convertir en pourcentage
            for i, proba in enumerate(prediction_proba)
        }
        
        logger.debug(f"Probabilités calculées: {probabilities}")
        logger.debug(f"Type des probabilités: {type(probabilities)}")
        logger.debug(f"Première probabilité: {next(iter(probabilities.items()))}")
        
        # Vérifier que la classe prédite a la plus haute probabilité
        predicted_class_index = prediction[0]
        predicted_class_prob = prediction_proba[predicted_class_index] * 100
        
        # Si la probabilité de la classe prédite n'est pas la plus élevée, ajuster
        max_prob_class = max(probabilities.items(), key=lambda x: x[1])
        if max_prob_class[0] != prediction_label:
            # Mettre à jour la prédiction avec la classe ayant la plus haute probabilité
            prediction_label = max_prob_class[0]
        
        # Obtenir les recommandations
        recommendations = get_recommendations(prediction_label)
        medecins_and_departement = get_medecins_and_departement(prediction_label)

        return jsonify({
            'prediction': prediction_label,
            'probabilities': probabilities,
            'recommendations': recommendations,
            'medecins_and_departement': medecins_and_departement
        })

    except Exception as e:
        print(f"Erreur lors de la prédiction : {str(e)}")
        return jsonify({'error': str(e)}), 500

@prediction_bp.route('/save', methods=['POST'])
@jwt_required()
def save_prediction():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        logger.debug(f"Saving prediction for user {current_user_id}")
        logger.debug(f"Prediction data: {data}")
        
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        
        # Convertir l'ID en entier pour la requête SQL
        user_id = int(current_user_id)

        # Obtenir l'ID du département à partir du nom du département
        departement_name = data['medecins_and_departement']['departement']['nom_depart']
        cursor.execute("SELECT id FROM departement WHERE nom_depart = %s", (departement_name,))
        departement = cursor.fetchone()
        
        if not departement:
            logger.error(f"Département non trouvé: {departement_name}")
            return jsonify({'error': 'Département non trouvé'}), 404

        # Insérer la prédiction
        cursor.execute("""
            INSERT INTO predictions (
                patient_id, 
                prediction, 
                probabilities, 
                recommendations, 
                departement_id
            )
            VALUES (%s, %s, %s, %s, %s)
        """, (
            user_id,
            data['prediction'],
            json.dumps(data['probabilities']),
            json.dumps(data['recommendations']),
            departement['id']
        ))
        
        conn.commit()
        cursor.close()
        conn.close()

        logger.info(f"Prédiction enregistrée avec succès pour l'utilisateur {user_id}")
        return jsonify({'message': 'Prédiction enregistrée avec succès'}), 200

    except Exception as e:
        logger.error(f"Erreur lors de la sauvegarde de la prédiction: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@prediction_bp.route('/download-pdf', methods=['POST'])
@jwt_required()
def download_prediction_pdf():
    data = request.get_json()
    user_id = get_jwt_identity()

    # Récupérer les infos utilisateur
    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    cursor.execute("SELECT nom, email, date_naissance FROM patients WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404

    # Récupérer les infos de prédiction depuis le POST
    prediction = data.get('prediction')
    departement = data.get('departement')
    date_prediction = data.get('date_prediction')
    recommendations = data.get('recommendations', [])

    # Générer le PDF amélioré
    pdf = FPDF()
    pdf.add_page()

    # Fond bleu clair
    pdf.set_fill_color(230, 240, 255)
    pdf.rect(0, 0, 210, 297, 'F')

    # Titre principal
    pdf.set_font("Arial", "B", 20)
    pdf.set_text_color(30, 60, 150)
    pdf.cell(0, 18, "Rapport de Prédiction Médicale", ln=True, align="C")

    pdf.ln(4)
    pdf.set_font("Arial", "", 12)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, f"Nom : {user['nom']}", ln=True)
    pdf.cell(0, 10, f"Email : {user['email']}", ln=True)
    pdf.cell(0, 10, f"Date de naissance : {user['date_naissance']}", ln=True)
    pdf.cell(0, 10, f"Date de prédiction : {date_prediction}", ln=True)

    # Encadré résultat
    pdf.ln(2)
    pdf.set_fill_color(200, 230, 201)  # vert très clair
    pdf.set_draw_color(56, 142, 60)    # vert foncé
    pdf.set_line_width(0.8)
    pdf.set_font("Arial", "B", 14)
    pdf.set_text_color(56, 142, 60)
    pdf.cell(0, 12, "Résultat de prédiction", ln=True, align="C")
    pdf.set_font("Arial", "", 13)
    pdf.set_text_color(0, 0, 0)
    y = pdf.get_y()
    pdf.set_xy(20, y)
    pdf.cell(170, 14, f"{prediction}", border=1, ln=True, align="C", fill=True)

    pdf.ln(6)
    pdf.set_font("Arial", "B", 13)
    pdf.set_text_color(30, 60, 150)
    pdf.cell(0, 10, "Département recommandé :", ln=True)
    pdf.set_font("Arial", "", 12)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, f"{departement}", ln=True)

    if recommendations:
        pdf.ln(4)
        pdf.set_font("Arial", "B", 13)
        pdf.set_text_color(30, 60, 150)
        pdf.cell(0, 10, "Conseils personnalisés :", ln=True)
        pdf.set_font("Arial", "", 12)
        pdf.set_text_color(33, 33, 33)
        for idx, rec in enumerate(recommendations, 1):
            pdf.multi_cell(0, 8, f"Conseil n°{idx} : {rec}", border=0)

    pdf_bytes = pdf.output(dest='S').encode('latin1')
    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype='application/pdf',
        as_attachment=True,
        download_name='rapport_prediction.pdf'
    )

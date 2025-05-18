from flask import Blueprint, request, jsonify
import pandas as pd
import pickle
import os
import pdfplumber
import io
import numpy as np
from werkzeug.utils import secure_filename

prediction_bp = Blueprint('prediction', __name__, url_prefix='/predict')

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

def extract_table_from_pdf(pdf_file):
    """Extrait les données tabulaires d'un fichier PDF."""
    try:
        with pdfplumber.open(pdf_file) as pdf:
            # Prendre la première page
            first_page = pdf.pages[0]
            # Extraire les tables
            tables = first_page.extract_tables()
            
            if not tables:
                raise ValueError("Aucune table trouvée dans le PDF")
            
            # Prendre la première table
            table = tables[0]
            
            # Convertir en DataFrame
            df = pd.DataFrame(table[1:], columns=table[0])
            
            # Convertir les colonnes numériques
            for col in df.columns:
                try:
                    df[col] = pd.to_numeric(df[col])
                except:
                    continue
            
            return df
    except Exception as e:
        raise Exception(f"Erreur lors de l'extraction du PDF: {str(e)}")

@prediction_bp.route('/ping', methods=['POST'])
def ping():
    return jsonify({"message": "pong"})

@prediction_bp.route('/', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier n\'a été envoyé'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Aucun fichier sélectionné'}), 400

    try:
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

        # Faire la prédiction
        prediction = model.predict(df[required_columns])
        prediction_label = label_encoder.inverse_transform(prediction)[0]
        
        # Obtenir les recommandations
        recommendations = get_recommendations(prediction_label)
        
        # Debug logs
        print(f"Prédiction brute: {prediction}")
        print(f"Label décodé: {prediction_label}")
        print(f"Recommandations: {recommendations}")
        
        return jsonify({
            'prediction': prediction_label,
            'recommendations': recommendations
        })

    except Exception as e:
        print(f"Erreur lors de la prédiction : {str(e)}")
        return jsonify({'error': str(e)}), 500


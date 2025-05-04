from flask import Blueprint, request, jsonify
import pandas as pd
import pickle
import os

prediction_bp = Blueprint('prediction', __name__, url_prefix='/predict')

# Charger le modèle
model_path = os.path.join(os.path.dirname(__file__), '../models/models_file.pkl')
with open(model_path, 'rb') as f:
    model = pickle.load(f)

# ✅ Classes que ton modèle est capable de prédire
HEALTH_CLASSES = [
    "Heart Di", "Thromboc", "Thalasse", "Healthy", "Anemia"
]

# ✅ Recommandations personnalisées pour chaque maladie
recommendations = {
    "Heart Di": [
        "Consultez un cardiologue pour un traitement spécialisé.",
        "Surveillez votre alimentation et votre niveau de stress."
    ],
    "Thromboc": [
        "Consultez un hématologue pour surveiller votre taux de plaquettes.",
        "Évitez les blessures et surveillez les signes de saignement."
    ],
    "Thalasse": [
        "Suivez un traitement médical pour équilibrer votre taux d’hémoglobine.",
        "Consultez régulièrement un spécialiste du sang."
    ],
    "Healthy": [
        "Continuez votre mode de vie sain et équilibré.",
        "Pratiquez une activité physique régulière."
    ],
    "Anemia": [
        "Augmentez votre consommation d’aliments riches en fer.",
        "Consultez votre médecin pour vérifier votre taux d'hémoglobine."
    ]
}

@prediction_bp.route('/ping', methods=['POST'])
def ping():
    return jsonify({"message": "pong"})
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier envoyé.'}), 400

    file = request.files['file']

    try:
        df = pd.read_csv(file)

        print("DataFrame reçu pour prédiction :")
        print(df.head())

        # 🔥 Faire la prédiction protégée
        prediction = model.predict(df)[0]

        print("Prediction brute reçue:", prediction)

        # 🔥 Attribution des conseils selon prédiction
        if prediction in HEALTH_CLASSES:
            advice = recommendations.get(prediction, ["Consultez un professionnel de santé."])
        else:
            advice = ["Maladie inconnue. Consultez un professionnel de santé."]

        response = {
            "prediction": prediction,
            "recommendations": advice
        }

        return jsonify(response)

    except Exception as e:
        import traceback
        print("Erreur serveur attrapée :", traceback.format_exc())
        return jsonify({'error': str(e)}), 500


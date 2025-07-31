from flask import Blueprint, request, jsonify
from openai import OpenAI
import logging
import json

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

chatbot_bp = Blueprint('chatbot', __name__)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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"
)

@chatbot_bp.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        user_message = request.json.get("message")
        logger.debug(f"Received message: {user_message}")

        # Ajout d'un prompt système pour guider le chatbot
        system_message = """Tu es un assistant médical professionnel, amical et multilingue.
Tu dois toujours répondre dans la même langue que la question posée. Si la question est en arabe, réponds en arabe. Si elle est en français, réponds en français, etc. Ne mélange pas les langues dans une même réponse.

Tu travailles dans une application de santé intelligente appelée 'IMAD's Startup'.
Voici ses fonctionnalités principales :
- Prédiction du risque de maladie via un formulaire ou un fichier d'analyse (CSV ou PDF).
- Recommandations personnalisées après la prédiction.
- Chatbot médical pour répondre aux questions générales.
- Tableau de bord pour visualiser les prédictions, historiques et données du patient.
- Gestion sécurisée des comptes utilisateurs (connexion/inscription).

Réponds de manière claire, concise, adaptée au niveau du patient.
Si on te salue, réponds de manière chaleureuse dans la langue de la question.
Si la question porte sur les fonctionnalités de l’application, liste-les dans la bonne langue.
N'invente jamais d'informations médicales.
"""


        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://openrouter.ai/",
                "X-Title": "Medical Chatbot",
            },
            model="mistralai/mistral-7b-instruct",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=500
        )

        # Log the raw response
        logger.debug(f"Raw API response: {completion}")
        
        if hasattr(completion, 'error') and completion.error:
            logger.error(f"API Error: {completion.error}")
            return jsonify({
                "error": "Erreur de l'API",
                "details": completion.error.get('message', 'Erreur inconnue')
            }), 500

        if not completion or not completion.choices:
            logger.error("No response from API")
            return jsonify({
                "error": "Pas de réponse de l'API",
                "details": "La réponse de l'API est vide"
            }), 500

        bot_response = completion.choices[0].message.content
        logger.debug(f"Bot response: {bot_response}")

        return jsonify({"choices": [{"message": {"content": bot_response}}]})

    except Exception as e:
        logger.error(f"Error in chatbot: {str(e)}")
        return jsonify({
            "error": "Erreur lors de la communication avec l'API",
            "details": str(e)
        }), 500

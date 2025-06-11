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
        system_message = """Tu es un assistant médical professionnel et amical. 
        Réponds aux questions de manière claire et concise.
        Si on te salue, réponds de manière amicale.
        Si on te pose une question médicale, donne une réponse professionnelle et factuelle.
        N'invente pas d'informations médicales."""

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
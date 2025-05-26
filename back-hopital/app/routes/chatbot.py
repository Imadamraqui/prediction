from flask import Blueprint, request, jsonify
import requests

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('/chatbot', methods=['POST'])
def chatbot():
    user_message = request.json.get("message")

    headers = {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "deepseek/deepseek-r1:free",
        "messages": [{"role": "user", "content": user_message}]
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
    return jsonify(response.json())

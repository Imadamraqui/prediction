from flask import Blueprint

prediction_bp = Blueprint('prediction', __name__, url_prefix='/predict')

@prediction_bp.route('/', methods=['GET'])
def test_prediction():
    return {'message': 'Prediction route active'}, 200

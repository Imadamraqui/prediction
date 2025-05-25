from flask import Blueprint, jsonify
from app.models.departement import Departement
from flask_cors import cross_origin
from app import db

departements_bp = Blueprint('departements', __name__)

@departements_bp.route('/', methods=['GET'])
@cross_origin()
def get_departements():
    try:
        departements = Departement.query.all()
        return jsonify([{
            'id': d.id,
            'nom_depart': d.nom_depart,
            'description': d.description,
            'classe_pred': d.classe_pred
        } for d in departements])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@departements_bp.route('/<int:id>', methods=['GET'])
@cross_origin()
def get_departement(id):
    try:
        departement = Departement.query.get(id)
        if departement:
            return jsonify({
                'id': departement.id,
                'nom_depart': departement.nom_depart,
                'description': departement.description,
                'classe_pred': departement.classe_pred
            })
        return jsonify({"error": "Département introuvable"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500 
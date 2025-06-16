from flask import Blueprint, jsonify, request
from app.models.medecin import Medecin
from app.models.departement import Departement
from flask_cors import cross_origin
from app import db
import logging

logger = logging.getLogger(__name__)
medecins_bp = Blueprint('medecins', __name__)

@medecins_bp.route('/medecins', methods=['GET'])
@cross_origin()
def get_medecins():
    try:
        departement_id = request.args.get('departement_id')

        if departement_id:
            medecins = Medecin.query.filter_by(departement_id=departement_id).all()
        else:
            medecins = Medecin.query.all()

        return jsonify([{
            'id': m.id,
            'nom': m.nom,
            'email': m.email,
            'grade': m.grade,
            'photo_url': m.photo_url,
            'specialite': m.specialite,
            'departement': m.departement.nom_depart if m.departement else None
        } for m in medecins])
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des médecins: {str(e)}")
        return jsonify({"error": str(e)}), 500

@medecins_bp.route('/medecins/<int:id>', methods=['GET'])
@cross_origin()
def get_medecin(id):
    try:
        medecin = Medecin.query.get(id)
        if medecin:
            return jsonify({
                'id': medecin.id,
                'nom': medecin.nom,
                'email': medecin.email,
                'grade': medecin.grade,
                'photo_url': medecin.photo_url,
                'specialite': medecin.specialite,
                'departement': medecin.departement.nom_depart if medecin.departement else None
            })
        return jsonify({"error": "Médecin introuvable"}), 404
    except Exception as e:
        logger.error(f"Erreur lors de la récupération du médecin: {str(e)}")
        return jsonify({"error": str(e)}), 500

@medecins_bp.route('/update-departements', methods=['POST'])
@cross_origin()
def update_medecins_departements():
    try:
        # Mapping des spécialités vers les départements
        specialite_to_departement = {
            'Endocrinologie': 1,
            'Cardiologie': 2,
            'Hématologie': 4,
            'Thalassémie': 4,
            'Anémie': 5,
            'Thrombocytopathie': 6
        }

        for medecin in Medecin.query.all():
            medecin.departement_id = specialite_to_departement.get(medecin.specialite, 1)

        db.session.commit()
        return jsonify({"message": "Médecins mis à jour avec succès"}), 200

    except Exception as e:
        logger.error(f"Erreur lors de la mise à jour des médecins: {str(e)}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@medecins_bp.route('/debug', methods=['GET'])
@cross_origin()
def debug_medecins():
    try:
        medecins = Medecin.query.all()
        debug_info = [{
            'id': m.id,
            'nom': m.nom,
            'specialite': m.specialite,
            'departement_id': m.departement_id,
            'departement': m.departement.nom_depart if m.departement else None
        } for m in medecins]
        return jsonify(debug_info), 200
    except Exception as e:
        logger.error(f"Erreur lors du débogage des médecins: {str(e)}")
        return jsonify({"error": str(e)}), 500

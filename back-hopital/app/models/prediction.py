from app import db
from datetime import datetime
import json
from app.models.patient import Patient
from app.models.departement import Departement
from app.models.medecin import Medecin

class Prediction(db.Model):
    __tablename__ = 'predictions'

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    prediction = db.Column(db.String(255), nullable=False)
    probabilities = db.Column(db.JSON, nullable=False)
    recommendations = db.Column(db.JSON, nullable=False)
    departement_id = db.Column(db.Integer, db.ForeignKey('departement.id'), nullable=False)
    medecin_id = db.Column(db.Integer, db.ForeignKey('medecins.id'), nullable=False)
    date_prediction = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Relations
    patient = db.relationship('Patient', backref=db.backref('predictions', lazy=True))
    departement = db.relationship('Departement', backref=db.backref('predictions', lazy=True))
    medecin = db.relationship('Medecin', backref=db.backref('predictions', lazy=True))

    def __init__(self, patient_id, prediction, probabilities, recommendations, departement_id, medecin_id):
        self.patient_id = patient_id
        self.prediction = prediction
        self.probabilities = probabilities
        self.recommendations = recommendations
        self.departement_id = departement_id
        self.medecin_id = medecin_id

    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'prediction': self.prediction,
            'probabilities': self.probabilities,
            'recommendations': self.recommendations,
            'departement_id': self.departement_id,
            'medecin_id': self.medecin_id,
            'date_prediction': self.date_prediction.isoformat()
        }

    def __repr__(self):
        return f'<Prediction {self.id}>' 
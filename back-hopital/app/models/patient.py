from app import db
from datetime import datetime

class Patient(db.Model):
    __tablename__ = 'patients'

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    mot_de_passe = db.Column(db.String(255), nullable=False)
    date_naissance = db.Column(db.Date)
    sexe = db.Column(db.String(10))
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Patient {self.nom}>' 
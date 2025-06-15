from app import db

class Medecin(db.Model):
    __tablename__ = 'medecins'

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    grade = db.Column(db.String(50))
    photo_url = db.Column(db.String(255))
    specialite = db.Column(db.String(100))
    departement_id = db.Column(db.Integer, db.ForeignKey('departement.id'), nullable=False)

    # Relation avec le département
    departement = db.relationship('Departement', backref=db.backref('medecins', lazy=True))

    def __repr__(self):
        return f'<Medecin {self.nom}>' 
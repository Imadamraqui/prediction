from app import db

class Departement(db.Model):
    __tablename__ = 'departement'

    id = db.Column(db.Integer, primary_key=True)
    nom_depart = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    classe_pred = db.Column(db.String(50))

    def __repr__(self):
        return f'<Departement {self.nom_depart}>' 
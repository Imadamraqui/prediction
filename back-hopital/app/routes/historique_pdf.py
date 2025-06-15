from flask import Blueprint, send_file, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.prediction import Prediction
from app import db
from fpdf import FPDF
from datetime import datetime
import io

historique_pdf_bp = Blueprint("historique_pdf", __name__)

@historique_pdf_bp.route("/api/pdf-historique", methods=["GET"])
@jwt_required()
def generate_prediction_history_pdf():
    user_id = get_jwt_identity()

    predictions = (
        Prediction.query
        .filter_by(user_id=user_id)
        .order_by(Prediction.date_prediction.desc())
        .all()
    )

    class HistoryPDF(FPDF):
        def header(self):
            self.set_font('Arial', 'B', 14)
            self.cell(0, 10, "Historique des Prédictions Médicales", ln=True, align='C')
            self.set_font('Arial', 'I', 10)
            self.cell(0, 8, f"Date : {datetime.now().strftime('%d/%m/%Y %H:%M')}", ln=True, align='C')
            self.ln(5)

        def footer(self):
            self.set_y(-10)
            self.set_font('Arial', 'I', 8)
            self.cell(0, 5, f'Page {self.page_no()}', align='C')

        def add_predictions(self, preds):
            self.set_font('Arial', 'B', 11)
            self.cell(60, 8, "Date", 1)
            self.cell(60, 8, "Prédiction", 1)
            self.cell(70, 8, "Département", 1, ln=True)

            self.set_font('Arial', '', 10)
            for pred in preds:
                self.cell(60, 7, pred.date_prediction.strftime("%d/%m/%Y %H:%M"), 1)
                self.cell(60, 7, pred.prediction, 1)
                self.cell(70, 7, pred.departement.nom_depart if pred.departement else "N/A", 1, ln=True)

    pdf = HistoryPDF()
    pdf.add_page()
    pdf.add_predictions(predictions)

    buffer = io.BytesIO()
    pdf.output(buffer)
    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name="historique_sante.pdf",
        mimetype="application/pdf"
    )

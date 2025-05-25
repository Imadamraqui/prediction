from fpdf import FPDF
import random
import os

# Données générées aléatoirement
data_map = {
    "Glucose": round(random.uniform(0.1, 1.0), 6),
    "Cholesterol": round(random.uniform(0.1, 1.0), 6),
    "Hemoglobin": round(random.uniform(0.1, 1.0), 6),
    "Platelets": round(random.uniform(0.1, 1.0), 6),
    "White Blood Cells": round(random.uniform(0.1, 1.0), 6),
    "Red Blood Cells": round(random.uniform(0.1, 1.0), 6),
    "Hematocrit": round(random.uniform(0.1, 1.0), 6),
    "Mean Corpuscular Volume": round(random.uniform(0.1, 1.0), 6),
    "Mean Corpuscular Hemoglobin": round(random.uniform(0.1, 1.0), 6),
    "Mean Corpuscular Hemoglobin Concentration": round(random.uniform(0.1, 1.0), 6),
    "Insulin": round(random.uniform(0.1, 1.0), 6),
    "BMI": round(random.uniform(0.1, 1.0), 6),
    "Systolic Blood Pressure": round(random.uniform(0.1, 1.0), 6),
    "Diastolic Blood Pressure": round(random.uniform(0.1, 1.0), 6),
    "Triglycerides": round(random.uniform(0.1, 1.0), 6),
    "HbA1c": round(random.uniform(0.1, 1.0), 6),
    "LDL Cholesterol": round(random.uniform(0.1, 1.0), 6),
    "HDL Cholesterol": round(random.uniform(0.1, 1.0), 6),
    "ALT": round(random.uniform(0.1, 1.0), 6),
    "AST": round(random.uniform(0.1, 1.0), 6),
    "Heart Rate": round(random.uniform(0.1, 1.0), 6),
    "Creatinine": round(random.uniform(0.1, 1.0), 6),
    "Troponin": round(random.uniform(0.1, 1.0), 6),
    "C-reactive Protein": round(random.uniform(0.1, 1.0), 6),
}

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 16)
        self.cell(0, 10, "Rapport de Prédiction Médicale", ln=1, align='C')
        logo_path = "app/static/logo.png"
        if os.path.exists(logo_path):
            self.image(logo_path, 10, 8, 20)
        self.set_font('Arial', '', 12)
        self.cell(0, 10, "Nom: Jean Dupont    |    Date: 2024-05-20", ln=1, align='C')
        self.ln(8)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')

    def add_vertical_table(self, data_map):
        self.set_font('Arial', '', 11)
        for key, value in data_map.items():
            label = f"{key:<35}"
            val_text = f"{value}"
            self.cell(120, 8, label, ln=0)
            self.cell(0, 8, val_text, ln=1, align='R')  # align right

# Génération PDF
pdf = PDF()
pdf.add_page()
pdf.add_vertical_table(data_map)

output_path = "app/test_files/test25.pdf"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
pdf.output(output_path)
print(f"✅ PDF vertical généré : {output_path}")

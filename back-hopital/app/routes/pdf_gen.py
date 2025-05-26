from fpdf import FPDF
import random
import os
from datetime import datetime

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
        # Logo en filigrane (watermark)
        logo_path = "app/routes/download.png"
        if os.path.exists(logo_path):
            # Sauvegarder l'état actuel
            self.set_text_color(200, 200, 200)  # Gris clair pour le filigrane
            self.set_font('Arial', 'B', 60)
            self.set_xy(40, 80)
            self.cell(130, 130, "HOPITAL", 0, 0, 'C')
            self.set_text_color(0, 0, 0)  # Retour à la couleur noire normale
        
        # Logo normal en haut
        if os.path.exists(logo_path):
            self.image(logo_path, 10, 5, 15)  # Logo plus petit et plus haut
        
        # Titre principal
        self.set_font('Arial', 'B', 14)
        self.set_xy(0, 5)  # Position Y réduite
        self.cell(210, 8, "RAPPORT D'ANALYSES MÉDICALES", 0, 1, 'C')  # Largeur totale de la page
        
        # Sous-titre avec date
        self.set_font('Arial', 'I', 9)
        self.cell(210, 6, f"Date: {datetime.now().strftime('%d/%m/%Y')}", ln=1, align='C')
        
        # Informations du patient (simulées)
        self.set_font('Arial', '', 9)
        self.cell(210, 4, "Nom: imad", ln=1, align='L')
        self.cell(210, 4, "Date de naissance: " + f"{random.randint(1,28)}/{random.randint(1,12)}/{random.randint(1999,2003)}", ln=1, align='L')
        
        # Ligne de séparation
        self.set_draw_color(0, 0, 0)
        self.line(10, self.get_y() + 2, 200, self.get_y() + 2)
        self.ln(4)

    def footer(self):
        self.set_y(-10)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 5, f'Page {self.page_no()} - Ce rapport est généré automatiquement par le système', align='C')

    def add_vertical_table(self, data_map):
        # En-tête du tableau
        self.set_font('Arial', 'B', 11)
        self.cell(0, 6, "RÉSULTATS DES ANALYSES", ln=1, align='L')
        self.ln(2)
        
        # Ligne d'en-tête du tableau
        self.set_font('Arial', 'B', 10)
        self.set_fill_color(200, 200, 200)
        self.cell(120, 6, "PARAMÈTRE", 0, 0, 'L', True)
        self.cell(70, 6, "VALEUR", 0, 1, 'C', True)
        
        # Données du tableau
        self.set_font('Arial', '', 9)
        for key, value in data_map.items():
            # Alternance des couleurs de fond
            fill = (240, 240, 240) if self.get_y() % 2 == 0 else (255, 255, 255)
            self.set_fill_color(*fill)
            
            label = f"{key:<35}"
            val_text = f"{value}"
            self.cell(120, 5, label, 0, 0, 'L', True)
            self.cell(70, 5, val_text, 0, 1, 'C', True)

# Génération PDF
pdf = PDF()
pdf.add_page()
pdf.add_vertical_table(data_map)

output_path = "app/test_files/testE.pdf"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
pdf.output(output_path)
print(f"✅ PDF vertical généré : {output_path}")

from fpdf import FPDF
import random
import os

# Génération des données aléatoires pour le PDF de test
def generate_test_data():
    data = [
        ["Glucose", "Cholesterol", "Hemoglobin", "Platelets", "White Blood Cells",
         "Red Blood Cells", "Hematocrit", "Mean Corpuscular Volume",
         "Mean Corpuscular Hemoglobin", "Mean Corpuscular Hemoglobin Concentration",
         "Insulin", "BMI", "Systolic Blood Pressure", "Diastolic Blood Pressure",
         "Triglycerides", "HbA1c", "LDL Cholesterol", "HDL Cholesterol",
         "ALT", "AST", "Heart Rate", "Creatinine", "Troponin", "C-reactive Protein"]
    ]

    # Génération d'une ligne de données aléatoires
    row = [round(random.uniform(0.1, 1.0), 6) for _ in range(24)]
    data.append(row)

    return data

# Création du PDF structuré en table
class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'Données de Santé - Test Prediction', 0, 1, 'C')

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

    def add_table(self, data):
        self.set_font('Arial', '', 8)
        col_width = self.w / len(data[0])  # Ajuster la largeur pour l'ensemble du tableau
        line_height = 10

        # Ajouter les en-têtes de colonne
        for col in data[0]:
            self.cell(col_width, line_height, col, border=1, align='C', fill=True)
        self.ln()

        # Ajouter les lignes de données
        for row in data[1:]:
            for item in row:
                self.cell(col_width, line_height, str(item), border=1, align='C')
            self.ln()

# Génération des données
data = generate_test_data()

# Création du PDF
pdf = PDF()
pdf.add_page()
pdf.add_table(data)

# Enregistrer le PDF
output_path = "app/test_files/testx.pdf"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
pdf.output(output_path)
print(f"PDF généré avec succès : {output_path}")

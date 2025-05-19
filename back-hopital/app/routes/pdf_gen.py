from fpdf import FPDF
import random

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

# Création du PDF avec une largeur ajustée
class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 14)
        self.cell(0, 10, 'Données de Santé - Test Prediction', 0, 1, 'C')

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

    def add_table(self, data):
        self.set_font('Arial', '', 10)  # Réduire la taille de la police
        self.set_fill_color(200, 220, 255)

        # Largeur des colonnes ajustée
        col_widths = [40 if len(col) > 10 else 30 for col in data[0]]
        line_height = 8

        # Ajouter les en-têtes de colonne avec fond coloré
        for col, width in zip(data[0], col_widths):
            col_name = str(col).encode('latin1', errors='replace').decode('latin1')
            self.multi_cell(width, line_height, col_name, border=1, align='C', fill=True)
        self.ln()

        # Ajouter les lignes de données
        for row in data[1:]:
            for value, width in zip(row, col_widths):
                # Convertir chaque valeur en chaîne de caractères avec formatage
                value_text = f"{value:.6f}"
                self.multi_cell(width, line_height, value_text, border=1, align='C')
            self.ln()

# Génération des données
data = generate_test_data()

# Création du PDF
pdf = PDF(orientation='L', unit='mm', format='A4')  # Format paysage pour plus d'espace
pdf.add_page()
pdf.add_table(data)

# Enregistrer le PDF
output_path = "app/test_files/test4.pdf"
pdf.output(output_path)
print(f"PDF généré avec succès : {output_path}")

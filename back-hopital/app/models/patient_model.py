from app.models.database import get_db_connection

def check_patient_credentials(email, mot_de_passe):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT mot_de_passe FROM patients WHERE email = %s", (email,))
    row = cursor.fetchone()
    conn.close()

    if row:
        if row[0] == mot_de_passe:
            return True

    return False

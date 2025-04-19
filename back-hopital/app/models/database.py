import pymysql

# Fonction pour créer une connexion à la base de données MySQL

def get_db_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="",  # Remplacer par ton mot de passe si nécessaire
        database="Hopital",
        cursorclass=pymysql.cursors.Cursor  # Tu peux aussi utiliser DictCursor
    )

# Supprimer node_modules, venv et .next s'ils existent
if (Test-Path "front-hopital\node_modules") {
    Remove-Item -Recurse -Force "front-hopital\node_modules"
}

if (Test-Path "front-hopital\.next") {
    Remove-Item -Recurse -Force "front-hopital\.next"
}

if (Test-Path "back-hopital\venv") {
    Remove-Item -Recurse -Force "back-hopital\venv"
}

# Ajouter ou mettre à jour le fichier .gitignore
Set-Content .gitignore @"
# Ignore virtual environments
back-hopital/venv/
front-hopital/venv/

# Ignore Node.js dependencies
front-hopital/node_modules/

# Ignore Next.js build output
front-hopital/.next/

# Python cache
__pycache__/
*.pyc
*.pyo
*.pyd

# Environment variables
.env
*.env

# VSCode settings
.vscode/

# System files
.DS_Store
Thumbs.db
"@

# Ajouter les changements
git add .
git commit -m "Nettoyage complet : suppression venv, node_modules, .next et mise à jour .gitignore"
git push --force

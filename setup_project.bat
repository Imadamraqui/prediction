@echo off
echo Création des fichiers de projet...

echo # Node.js (frontend) > .gitignore
echo front-hopital/node_modules/ >> .gitignore
echo back-hopital/__pycache__/ >> .gitignore
echo *.pyc >> .gitignore
echo .env >> .gitignore

echo # Projet Hopital Web > README.md
echo. >> README.md
echo ## Contient front-end et back-end >> README.md

echo API_URL=http://localhost:5000 > .env.example
echo JWT_SECRET=your_jwt_key_here >> .env.example

echo root = true > .editorconfig
echo indent_style = space >> .editorconfig
echo indent_size = 2 >> .editorconfig

echo MIT License > LICENSE

git init
git add .
git commit -m "Initial commit avec fichiers de config"

echo ✅ Projet initialisé avec succès !
pause

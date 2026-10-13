# Santé+ — Intelligent Hospital Web Platform

Santé+ is a full-stack academic healthcare platform that combines web development, data management and artificial intelligence to support patients through disease-risk prediction, medical recommendations and an integrated conversational assistant.

The project contains a **Next.js frontend**, a **Flask REST API**, a **MySQL database** and a **Machine Learning prediction module** based on XGBoost.

> **Disclaimer:** This project was developed for educational purposes only. Predictions and chatbot responses must not be considered medical diagnoses or professional medical advice.

## Main Features

- User registration and authentication with JWT
- Patient profile and healthcare data management
- Disease prediction from blood-analysis data
- Support for CSV and PDF analysis files
- Multi-class prediction with probability scores
- Personalized recommendations based on the predicted class
- Doctor and hospital department recommendations
- Medical chatbot for general assistance
- Dashboard for predictions, statistics and patient history
- PDF generation and prediction-history management
- REST API connecting the frontend, backend and database

## Prediction Module

The prediction service processes biological and clinical indicators such as glucose, cholesterol, hemoglobin, platelets, blood pressure, BMI and other blood-analysis values.

The trained model can classify the submitted data into several health categories, including:

- Diabetes
- Heart disease
- Healthy
- Thalassemia
- Anemia
- Thrombocytopathy

After prediction, the backend returns the predicted class, class probabilities, recommendations and, when available, a suitable medical department and doctors.

## Project Architecture

```text
prediction/
├── back-hopital/              # Flask backend / REST API
│   ├── app/
│   │   ├── data/              # Data resources
│   │   ├── models/            # Database and ML models
│   │   ├── routes/            # API routes
│   │   └── __init__.py        # Flask application factory
│   ├── migrations/            # Database migrations
│   ├── requirements.txt       # Python dependencies
│   └── run.py                 # Backend entry point
│
├── front-hopital/             # Next.js frontend
│   ├── public/
│   ├── src/
│   │   ├── app/               # Pages and application routes
│   │   ├── components/        # Reusable UI components
│   │   └── lib/               # Utilities and shared logic
│   └── package.json
│
├── hopital (3).sql            # Database initialization script
└── README.md
```

## Tech Stack

### Backend & AI

- Python
- Flask
- Flask-SQLAlchemy
- Flask-JWT-Extended
- MySQL / PyMySQL
- Pandas
- NumPy
- Scikit-learn
- XGBoost

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts

### Other

- REST APIs
- JWT authentication
- PDF processing
- Git / GitHub

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Imadamraqui/prediction.git
cd prediction
```

### 2. Prepare the database

Create a MySQL database named `hopital`, then import the SQL file available at the root of the repository:

```bash
mysql -u root -p hopital < "hopital (3).sql"
```

Update the database configuration in the backend if your local MySQL credentials are different.

### 3. Run the backend

```bash
cd back-hopital
python -m venv venv
```

Activate the environment:

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

Install dependencies and start the API:

```bash
pip install -r requirements.txt
python run.py
```

### 4. Run the frontend

Open another terminal:

```bash
cd front-hopital
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Main Application Modules

### Authentication
Handles account registration, login and protected access to patient functionality.

### Health Prediction
Accepts biological-analysis data, runs the trained XGBoost model and returns prediction probabilities and recommendations.

### Medical Recommendation
Connects prediction results with relevant hospital departments and available doctors.

### Chatbot
Provides a conversational interface for general health-related questions and guidance about the platform.

### Dashboard & History
Allows users to consult stored predictions, statistics and previous analyses.

## API Overview

The Flask backend is organized into multiple route groups, including:

```text
/api/auth
/api/patient
/api/departements
/api/prediction
/api/predictions
/api/medecins
```

Additional endpoints are available for statistics, chatbot interactions and PDF/history management.

## Security Notes

For a production deployment:

- Store API keys and secrets in environment variables
- Never commit API keys or credentials to GitHub
- Replace development JWT secrets
- Protect database credentials
- Restrict CORS to trusted origins
- Use HTTPS
- Validate uploaded files and user input

## Academic Context

This project was developed as part of a software engineering and artificial intelligence project focused on applying Machine Learning to a healthcare use case. Its objective is to demonstrate how predictive models can be integrated into a complete web application alongside authentication, data management, visualization and conversational assistance.

## Author

**Imad-Eddine Amraqui**

- GitHub: [Imadamraqui](https://github.com/Imadamraqui)
- LinkedIn: [imad10](https://www.linkedin.com/in/imad10)

## License

See the `LICENSE` file included in this repository.

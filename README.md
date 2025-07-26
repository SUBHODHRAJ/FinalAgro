AgroIndia - Smart Crop Disease Detection and Monitoring System
AgroIndia is an AI-powered web platform designed to assist agricultural stakeholders in detecting crop diseases from imagery and providing evidence-based recommendations for remedies and preventive measures. The system employs deep learning models for crop type and disease classification, and incorporates multilingual support, an interactive chat interface, and a robust disease tracking mechanism.
Features
 * AI-based crop and disease detection: Utilizes Convolutional Neural Network (CNN) models for accurate identification.
 * Crop-specific disease classifiers: Employs specialized models for each crop type to ensure high classification accuracy.
 * Image-based remedies, identification, and prevention guidelines: Provides detailed information derived from visual analysis.
 * Reference imagery: Includes visual examples of healthy crops and those exhibiting early, moderate, and severe disease symptoms.
 * Monitoring page with AI-based recommendations: Offers insights and suggestions based on detected disease patterns.
 * Chat Assistant: Facilitates user interaction and guidance.
 * Multi-language support: Available in English, Tamil, Hindi, and Bengali.
Machine Learning Overview
Crop Classifier: allcrop.keras identifies the crop type from an uploaded image.
Disease Classifiers: Dedicated models are trained for each supported crop:
 * corn.keras
 * tomato.keras
 * rice.keras
 * wheat.keras
 * sugarcane.keras
 * cotton.keras
 * potato.keras
Each model is trained on labeled disease datasets, ensuring high accuracy and confidence in its predictions.
Project Structure
AgroIndia/
├── backend/
│   ├── main.py             # FastAPI backend logic
│   └── models/             # Trained .keras models
├── frontend/
│   ├── src/
│   │   ├── pages/          # Upload, Result, Monitor
│   │   ├── images/         # Healthy, early, moderate, severe reference images
│   │   ├── contexts/       # Language and chat context
│   │   ├── types.ts        # Type definitions
│   │   └── ...
│   └── public/
├── requirements.txt
└── README.md

Setup Instructions
1. Backend (FastAPI)
Navigate to the backend directory and execute the following commands:
cd backend
python -m venv venv
source venv/bin/activate  # For Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

The backend server will run on http://localhost:8000.
2. Frontend (React + Vite)
Navigate to the frontend directory and execute the following commands:
cd frontend
npm install
npm run dev

The frontend application will run on http://localhost:5173.
API Response Example
Endpoint: POST /predict
Response Body:
{
  "crop": "Corn",
  "disease": "Common Rust",
  "remedy": "Use fungicides like azoxystrobin...",
  "identification": "Reddish-brown pustules...",
  "preventiveMeasures": [
    "Use resistant varieties",
    "Rotate crops",
    "Avoid overhead irrigation"
  ],
  "Ref_images": {
    "healthy": "/src/images/corn_healthy.jpg",
    "early": "/src/images/rust_early.jpg",
    "moderate": "/src/images/corn_rust2.jpg",
    "severe": "/src/images/rust_severe.png"
  },
  "timestamp": "2025-07-26T12:30:00Z"
}

Monitoring Page
The monitoring interface provides a historical record of detected diseases, displaying relevant information such as crop location, disease type, detection date, and associated reference imagery.
AI Recommendation Engine
The integrated AI recommendation engine offers the following functionalities:
 * Suggests preventive measures to mitigate future disease outbreaks.
 * Tracks recurring diseases to identify persistent issues.
 * Assists in seasonal forecasting of potential disease prevalence.
Chat Assistant
The Chat Assistant supports four languages: English, Tamil, Hindi, and Bengali. It provides guidance on various agricultural topics, including:
 * Disease prevention strategies.
 * Remedial actions for detected diseases.
 * General crop care practices.
 * Pest control methods.
 * General fertilizer recommendations related to plant health.

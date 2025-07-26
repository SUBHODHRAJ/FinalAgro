AgroIndia - Smart Crop Disease Detection and Monitoring System

AgroIndia is an AI-powered web platform designed to assist agricultural stakeholders in detecting crop diseases from images and providing evidence-based recommendations for remedies and preventive measures. The platform integrates deep learning models, multilingual support, an interactive chat assistant, and a robust disease monitoring system.


---

Features

AI-based Crop and Disease Detection:
Utilizes Convolutional Neural Network (CNN) models for accurate detection.

Crop-specific Disease Classifiers:
Specialized models for each crop type ensure high classification accuracy.

Image-based Remedies and Guidelines:
Provides detailed remedies, identification methods, and preventive measures derived from image analysis.

Reference Imagery:
Visual examples of healthy crops and crops with early, moderate, and severe symptoms.

Monitoring Dashboard:
Historical tracking of detected diseases with AI-driven insights and recommendations.

Interactive Chat Assistant:
Provides multilingual guidance on disease prevention, remedies, and general crop care.

Multi-language Support:
Supports English, Tamil, Hindi, and Bengali.



---

Machine Learning Overview

Crop Classifier:
allcrop.keras – Identifies the crop type from uploaded images.

Disease Classifiers:
Dedicated deep learning models trained on labeled datasets for each crop:

corn.keras

tomato.keras

rice.keras

wheat.keras

sugarcane.keras

cotton.keras

potato.keras



Each model ensures high accuracy and confidence in disease predictions.


---

Project Structure

AgroIndia/
├── backend/
│   ├── main.py             # FastAPI backend logic
│   └── models/             # Trained .keras models
├── frontend/
│   ├── src/
│   │   ├── pages/          # Upload, Result, Monitor
│   │   ├── images/         # Healthy/early/moderate/severe reference images
│   │   ├── contexts/       # Language and chat context
│   │   ├── types.ts        # Type definitions
│   │   └── ...
│   └── public/
├── requirements.txt
└── README.md


---

Setup Instructions

Backend (FastAPI)

1. Navigate to the backend directory:

cd backend


2. Create and activate a virtual environment:

python -m venv venv
source venv/bin/activate  # For Windows: venv\Scripts\activate


3. Install dependencies:

pip install -r requirements.txt


4. Run the backend:

uvicorn main:app --reload



The backend server will run at http://localhost:8000


---

Frontend (React + Vite)

1. Navigate to the frontend directory:

cd frontend


2. Install dependencies:

npm install


3. Start the development server:

npm run dev



The frontend application will run at http://localhost:5173


---

API Example

Endpoint: POST /predict

Response:

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


---

Monitoring Dashboard

The Monitoring Page provides a historical record of detected diseases, displaying:

Crop type and location

Disease type

Detection date

Reference imagery



---

AI Recommendation Engine

The AI engine:

Suggests preventive measures to reduce future outbreaks

Tracks recurring diseases

Supports seasonal forecasting of disease prevalence



---

Chat Assistant

Supports English, Tamil, Hindi, and Bengali and offers guidance on:

Disease prevention strategies

Remedies for detected diseases

Pest control methods

Fertilizer and crop care recommendations
# 🌾 AgroIndia - Smart Crop Disease Detection and Monitoring System

AgroIndia is an AI-powered web platform designed to assist agricultural stakeholders in detecting crop diseases from imagery and providing evidence-based recommendations for remedies and preventive measures. The system employs deep learning models for crop type and disease classification, and incorporates multilingual support, an interactive chat interface, and a robust disease tracking mechanism.

---

## 🚀 Features

- ✅ AI-based crop and disease detection using CNN models.
- 🌿 Crop-specific disease classifiers for higher accuracy.
- 🖼️ Image-based remedies, identification, and prevention guidelines.
- 🧾 Reference imagery (healthy, early, moderate, severe).
- 📊 Monitoring page with AI-based recommendations.
- 💬 Chat Assistant for multilingual agricultural guidance.
- 🌐 Multi-language support: English, Tamil, Hindi, Bengali.

---

## 🤖 Machine Learning Overview

- Crop Classifier:  
  → allcrop.keras — detects the crop from an uploaded image.

- Disease Classifiers:  
  Specialized models per crop, trained for high-accuracy classification:
  - corn.keras
  - tomato.keras
  - rice.keras
  - wheat.keras
  - sugarcane.keras
  - cotton.keras
  - potato.keras

---

## 📁 Project Structure

```text
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
```

---

## ⚙️ Setup Instructions

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # For Windows: venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend will run at: http://localhost:8000

---

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: http://localhost:5173

---

## 📡 API Response Example

Endpoint: POST /predict  
Response:

```json
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
```

---

## 📈 Monitoring Dashboard

- Tracks detected diseases with:
  - Crop type and location
  - Detection date
  - Reference images
  - Disease type
- Offers AI-generated insights and history of reports.

---

## 🔍 AI Recommendation Engine

- Suggests preventive strategies to reduce outbreaks.
- Identifies recurring infections.
- Assists in seasonal disease forecasting.

---

## 💬 Chat Assistant

Multilingual chatbot for farmers and agronomists. Supports:
- Disease prevention and remedy advice
- General crop care best practices
- Fertilization and pest control guidance

Languages Supported:
- English 🇬🇧
- Tamil 🇮🇳
- Hindi 🇮🇳
- Bengali 🇧🇩

---

## 📄 License

This project is licensed under the MIT License.  
Feel free to fork and enhance AgroIndia for your local agricultural needs.

---

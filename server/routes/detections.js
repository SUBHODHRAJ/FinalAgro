const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Mock AI detection function (replace with actual AI model)
const mockDetectDisease = async (imagePath, cropType) => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const diseases = {
    tomato: ['Tomato Leaf Curl Virus', 'Early Blight', 'Bacterial Wilt'],
    potato: ['Late Blight', 'Potato Scab'],
    wheat: ['Rust', 'Powdery Mildew'],
    rice: ['Blast', 'Brown Spot'],
    corn: ['Corn Smut', 'Northern Leaf Blight']
  };

  const cropDiseases = diseases[cropType] || diseases.tomato;
  const isHealthy = Math.random() > 0.7; // 30% chance of disease

  if (isHealthy) {
    return {
      disease: 'Healthy Crop',
      confidence: 95 + Math.random() * 5,
      remedy: 'Your crop appears healthy! Continue with regular care and monitoring.',
      preventiveMeasures: [
        'Maintain regular watering schedule',
        'Monitor for early signs of disease',
        'Apply balanced fertilizer as needed'
      ]
    };
  }

  const disease = cropDiseases[Math.floor(Math.random() * cropDiseases.length)];
  const confidence = 75 + Math.random() * 20;

  return {
    disease,
    confidence,
    remedy: `Apply appropriate treatment for ${disease}. Consult local agricultural expert for specific recommendations.`,
    preventiveMeasures: [
      'Remove infected plant parts',
      'Improve air circulation',
      'Apply preventive fungicide spray',
      'Maintain proper plant spacing'
    ]
  };
};

// Create new disease detection
router.post('/detect', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { cropType, location, weatherConditions } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    if (!cropType) {
      return res.status(400).json({ error: 'Crop type is required' });
    }

    // Read image file as binary data
    const fs = require('fs');
    const imageData = fs.readFileSync(req.file.path);

    // Perform AI detection
    const detection = await mockDetectDisease(req.file.path, cropType);

    // Store detection in database
    const [result] = await pool.execute(`
      INSERT INTO disease_detections 
      (user_id, crop_type, disease_name, confidence_score, image_path, image_data, remedy, preventive_measures, location, weather_conditions)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id,
      cropType,
      detection.disease,
      detection.confidence,
      req.file.path,
      imageData,
      detection.remedy,
      JSON.stringify(detection.preventiveMeasures),
      location || null,
      weatherConditions ? JSON.stringify(weatherConditions) : null
    ]);

    // Clean up uploaded file (optional, since we store in DB)
    // fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      detection: {
        id: result.insertId,
        crop: cropType,
        disease: detection.disease,
        confidence: Math.round(detection.confidence),
        remedy: detection.remedy,
        preventiveMeasures: detection.preventiveMeasures,
        timestamp: new Date().toISOString(),
        imageUrl: `/api/detections/${result.insertId}/image`
      }
    });
  } catch (error) {
    console.error('Detection error:', error);
    res.status(500).json({ error: 'Disease detection failed' });
  }
});

// Get user's detection history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, cropType, diseaseType } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, crop_type, disease_name, confidence_score, remedy, 
             preventive_measures, location, detection_date
      FROM disease_detections 
      WHERE user_id = ?
    `;
    const params = [req.user.id];

    if (cropType) {
      query += ' AND crop_type = ?';
      params.push(cropType);
    }

    if (diseaseType) {
      query += ' AND disease_name LIKE ?';
      params.push(`%${diseaseType}%`);
    }

    query += ' ORDER BY detection_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [detections] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM disease_detections WHERE user_id = ?';
    const countParams = [req.user.id];

    if (cropType) {
      countQuery += ' AND crop_type = ?';
      countParams.push(cropType);
    }

    if (diseaseType) {
      countQuery += ' AND disease_name LIKE ?';
      countParams.push(`%${diseaseType}%`);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      detections: detections.map(d => ({
        id: d.id,
        crop: d.crop_type,
        disease: d.disease_name,
        confidence: d.confidence_score,
        remedy: d.remedy,
        preventiveMeasures: JSON.parse(d.preventive_measures || '[]'),
        location: d.location,
        timestamp: d.detection_date,
        imageUrl: `/api/detections/${d.id}/image`
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get detection history' });
  }
});

// Get detection image
router.get('/:id/image', authenticateToken, async (req, res) => {
  try {
    const [detections] = await pool.execute(
      'SELECT image_data FROM disease_detections WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (detections.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imageData = detections[0].image_data;
    res.set('Content-Type', 'image/jpeg');
    res.send(imageData);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ error: 'Failed to get image' });
  }
});

// Get detection statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { period = '30' } = req.query; // days

    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_detections,
        COUNT(CASE WHEN disease_name != 'Healthy Crop' THEN 1 END) as diseased_detections,
        COUNT(CASE WHEN disease_name = 'Healthy Crop' THEN 1 END) as healthy_detections,
        AVG(confidence_score) as avg_confidence
      FROM disease_detections 
      WHERE user_id = ? AND detection_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
    `, [req.user.id, parseInt(period)]);

    const [cropStats] = await pool.execute(`
      SELECT crop_type, COUNT(*) as count
      FROM disease_detections 
      WHERE user_id = ? AND detection_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY crop_type
      ORDER BY count DESC
    `, [req.user.id, parseInt(period)]);

    const [diseaseStats] = await pool.execute(`
      SELECT disease_name, COUNT(*) as count
      FROM disease_detections 
      WHERE user_id = ? AND detection_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
        AND disease_name != 'Healthy Crop'
      GROUP BY disease_name
      ORDER BY count DESC
      LIMIT 5
    `, [req.user.id, parseInt(period)]);

    res.json({
      success: true,
      stats: {
        totalDetections: stats[0].total_detections,
        diseasedDetections: stats[0].diseased_detections,
        healthyDetections: stats[0].healthy_detections,
        avgConfidence: Math.round(stats[0].avg_confidence || 0),
        cropBreakdown: cropStats,
        topDiseases: diseaseStats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

module.exports = router;
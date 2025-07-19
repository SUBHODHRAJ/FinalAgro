const cron = require('node-cron');
const { pool } = require('../config/database');
const { sendSMSOTP, sendEmailOTP } = require('./otpService');

// Send daily disease alerts
const sendDailyNotifications = async () => {
  try {
    console.log('Sending daily notifications...');
    
    // Get users who had disease detections in the last 24 hours
    const [recentDetections] = await pool.execute(`
      SELECT DISTINCT u.id, u.phone, u.email, u.name, u.language,
             COUNT(dd.id) as detection_count
      FROM users u
      JOIN disease_detections dd ON u.id = dd.user_id
      WHERE dd.detection_date >= DATE_SUB(NOW(), INTERVAL 1 DAY)
        AND dd.disease_name != 'Healthy Crop'
      GROUP BY u.id
    `);

    for (const user of recentDetections) {
      const message = getNotificationMessage(user.language, 'daily_alert', {
        count: user.detection_count
      });

      // Store notification in database
      await pool.execute(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [user.id, 'Daily Disease Alert', message, 'disease_alert']
      );

      // Send SMS notification (in production, you might want to batch these)
      if (user.phone) {
        await sendSMSOTP(user.phone, message);
      }
    }

    console.log(`Sent notifications to ${recentDetections.length} users`);
  } catch (error) {
    console.error('Daily notification error:', error);
  }
};

// Generate weekly reports
const generateWeeklyReports = async () => {
  try {
    console.log('Generating weekly reports...');
    
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weekEnd = new Date();

    // Get all users
    const [users] = await pool.execute('SELECT * FROM users WHERE is_verified = TRUE');

    for (const user of users) {
      // Get user's detections for the week
      const [detections] = await pool.execute(`
        SELECT * FROM disease_detections 
        WHERE user_id = ? AND detection_date BETWEEN ? AND ?
      `, [user.id, weekStart, weekEnd]);

      if (detections.length === 0) continue;

      const totalDetections = detections.length;
      const healthyCrops = detections.filter(d => d.disease_name === 'Healthy Crop').length;
      const diseasedCrops = totalDetections - healthyCrops;

      // Find most common disease
      const diseaseCount = {};
      detections.forEach(d => {
        if (d.disease_name !== 'Healthy Crop') {
          diseaseCount[d.disease_name] = (diseaseCount[d.disease_name] || 0) + 1;
        }
      });

      const mostCommonDisease = Object.keys(diseaseCount).reduce((a, b) => 
        diseaseCount[a] > diseaseCount[b] ? a : b, null
      );

      const reportData = {
        detections: detections.map(d => ({
          crop: d.crop_type,
          disease: d.disease_name,
          date: d.detection_date,
          confidence: d.confidence_score
        })),
        summary: {
          totalDetections,
          healthyCrops,
          diseasedCrops,
          mostCommonDisease
        }
      };

      // Store weekly report
      await pool.execute(`
        INSERT INTO weekly_reports 
        (user_id, week_start, week_end, total_detections, healthy_crops, diseased_crops, most_common_disease, report_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        user.id, weekStart, weekEnd, totalDetections, 
        healthyCrops, diseasedCrops, mostCommonDisease, 
        JSON.stringify(reportData)
      ]);

      // Send notification about weekly report
      const message = getNotificationMessage(user.language, 'weekly_report', {
        totalDetections,
        diseasedCrops,
        mostCommonDisease
      });

      await pool.execute(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [user.id, 'Weekly Crop Report', message, 'weekly_report']
      );
    }

    console.log(`Generated weekly reports for ${users.length} users`);
  } catch (error) {
    console.error('Weekly report generation error:', error);
  }
};

// Get localized notification messages
const getNotificationMessage = (language, type, data) => {
  const messages = {
    en: {
      daily_alert: `You detected ${data.count} crop issues today. Check your dashboard for treatment recommendations.`,
      weekly_report: `Weekly Report: ${data.totalDetections} scans, ${data.diseasedCrops} issues found. Most common: ${data.mostCommonDisease || 'None'}`
    },
    hi: {
      daily_alert: `आपने आज ${data.count} फसल समस्याएं पाईं। उपचार सुझावों के लिए डैशबोर्ड देखें।`,
      weekly_report: `साप्ताहिक रिपोर्ट: ${data.totalDetections} स्कैन, ${data.diseasedCrops} समस्याएं मिलीं। सबसे आम: ${data.mostCommonDisease || 'कोई नहीं'}`
    },
    ta: {
      daily_alert: `இன்று நீங்கள் ${data.count} பயிர் பிரச்சினைகளைக் கண்டறிந்தீர்கள். சிகிச்சை பரிந்துரைகளுக்கு உங்கள் டாஷ்போர்டைப் பார்க்கவும்.`,
      weekly_report: `வாராந்திர அறிக்கை: ${data.totalDetections} ஸ்கேன்கள், ${data.diseasedCrops} பிரச்சினைகள் கண்டறியப்பட்டன।`
    },
    bn: {
      daily_alert: `আজ আপনি ${data.count}টি ফসলের সমস্যা সনাক্ত করেছেন। চিকিৎসার পরামর্শের জন্য আপনার ড্যাশবোর্ড দেখুন।`,
      weekly_report: `সাপ্তাহিক রিপোর্ট: ${data.totalDetections} স্ক্যান, ${data.diseasedCrops} সমস্যা পাওয়া গেছে।`
    }
  };

  return messages[language]?.[type] || messages.en[type];
};

// Schedule notifications
const scheduleNotifications = () => {
  // Daily notifications at 8 AM
  cron.schedule('0 8 * * *', sendDailyNotifications);
  
  // Weekly reports every Sunday at 9 AM
  cron.schedule('0 9 * * 0', generateWeeklyReports);
  
  console.log('Notification scheduler initialized');
};

module.exports = {
  sendDailyNotifications,
  generateWeeklyReports,
  scheduleNotifications,
  getNotificationMessage
};
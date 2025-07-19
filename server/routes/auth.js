const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { generateOTP, sendSMSOTP, sendEmailOTP, storeOTP, verifyOTP } = require('../services/otpService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Send OTP for login/registration
router.post('/send-otp', async (req, res) => {
  try {
    const { phone, email } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const otp = generateOTP();
    
    // Store OTP in database
    const otpStored = await storeOTP(phone, otp);
    if (!otpStored) {
      return res.status(500).json({ error: 'Failed to generate OTP' });
    }

    // Send OTP via SMS
    const smsSent = await sendSMSOTP(phone, otp);
    
    // Send OTP via email if provided
    let emailSent = false;
    if (email) {
      emailSent = await sendEmailOTP(email, otp);
    }

    res.json({
      success: true,
      message: 'OTP sent successfully',
      channels: {
        sms: smsSent,
        email: emailSent
      }
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP and login/register
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp, name, email, location, language } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    // Verify OTP
    const otpResult = await verifyOTP(phone, otp);
    if (!otpResult.success) {
      return res.status(400).json({ error: otpResult.message });
    }

    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE phone = ?',
      [phone]
    );

    let user;
    let isNewUser = false;

    if (existingUsers.length === 0) {
      // Register new user
      if (!name) {
        return res.status(400).json({ error: 'Name is required for new users' });
      }

      const [result] = await pool.execute(
        'INSERT INTO users (phone, email, name, location, language, is_verified) VALUES (?, ?, ?, ?, ?, TRUE)',
        [phone, email || null, name, location || null, language || 'en']
      );

      user = {
        id: result.insertId,
        phone,
        email: email || null,
        name,
        location: location || null,
        language: language || 'en',
        is_verified: true
      };
      isNewUser = true;
    } else {
      // Update existing user verification status
      await pool.execute(
        'UPDATE users SET is_verified = TRUE WHERE phone = ?',
        [phone]
      );
      
      user = existingUsers[0];
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Store session
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await pool.execute(
      'INSERT INTO user_sessions (user_id, token, device_info, expires_at) VALUES (?, ?, ?, ?)',
      [user.id, token, JSON.stringify(req.headers), expiresAt]
    );

    res.json({
      success: true,
      message: isNewUser ? 'Account created successfully' : 'Login successful',
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        location: user.location,
        language: user.language
      },
      token,
      isNewUser
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, location, language } = req.body;
    
    await pool.execute(
      'UPDATE users SET name = ?, email = ?, location = ?, language = ? WHERE id = ?',
      [name, email, location, language, req.user.id]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Remove session
    await pool.execute(
      'DELETE FROM user_sessions WHERE user_id = ? AND token = ?',
      [req.user.id, token]
    );

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;
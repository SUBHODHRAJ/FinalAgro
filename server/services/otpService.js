const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { pool } = require('../config/database');

// Initialize Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Initialize email transporter
const emailTransporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS
const sendSMSOTP = async (phone, otp) => {
  try {
    await twilioClient.messages.create({
      body: `Your AgroGuardian OTP is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    return true;
  } catch (error) {
    console.error('SMS OTP error:', error);
    return false;
  }
};

// Send OTP via Email
const sendEmailOTP = async (email, otp) => {
  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'AgroGuardian - Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22C55E;">AgroGuardian Verification</h2>
          <p>Your verification code is:</p>
          <div style="background: #f0f9ff; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #22C55E; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Email OTP error:', error);
    return false;
  }
};

// Store OTP in database
const storeOTP = async (phone, otp) => {
  try {
    // Delete any existing OTPs for this phone
    await pool.execute('DELETE FROM otps WHERE phone = ?', [phone]);
    
    // Store new OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await pool.execute(
      'INSERT INTO otps (phone, otp, expires_at) VALUES (?, ?, ?)',
      [phone, otp, expiresAt]
    );
    return true;
  } catch (error) {
    console.error('Store OTP error:', error);
    return false;
  }
};

// Verify OTP
const verifyOTP = async (phone, otp) => {
  try {
    const [otps] = await pool.execute(
      'SELECT * FROM otps WHERE phone = ? AND otp = ? AND expires_at > NOW() AND is_used = FALSE',
      [phone, otp]
    );

    if (otps.length === 0) {
      return { success: false, message: 'Invalid or expired OTP' };
    }

    // Mark OTP as used
    await pool.execute(
      'UPDATE otps SET is_used = TRUE WHERE id = ?',
      [otps[0].id]
    );

    return { success: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error('Verify OTP error:', error);
    return { success: false, message: 'OTP verification failed' };
  }
};

module.exports = {
  generateOTP,
  sendSMSOTP,
  sendEmailOTP,
  storeOTP,
  verifyOTP
};
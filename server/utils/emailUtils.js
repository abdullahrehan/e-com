// utils/emailUtils.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "abdullahrehan753@gmail.com",
    pass: "mwsa ipsc pktc dioa"
  },
  pool: true,
  maxConnections: 1,
  socketTimeout: 30 * 1000
});

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Our Platform</h2>
        <p>Please verify your email address using the code below:</p>
        <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; margin: 20px 0;">
          ${code}
        </div>
        <p>This code expires in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} Your Company</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendResetPasswordEmail = async (email, code) => {
  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Reset Your Password</h2>
              <p>We received a request to reset your password. Use the verification code below:</p>
              <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; margin: 20px 0;">
                  ${code}
              </div>
              <p>This code expires in 10 minutes.</p>
              <p>If you didn't request this, please ignore this email.</p>
              <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} Your Company</p>
          </div>
      `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  generateVerificationCode,
  sendVerificationEmail,
  sendResetPasswordEmail
};
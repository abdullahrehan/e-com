// controllers/userController.js
const { User } = require('../models/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { generateVerificationCode, sendVerificationEmail, sendResetPasswordEmail } = require('../utils/emailUtils');

// Create User
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, adminRole } = req.body;

        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({ status: 'error', message: 'Name, email, and password are required', data: null });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: 'error', message: 'Invalid email format', data: null });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ status: 'error', message: 'Password must meet complexity requirements', data: null });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'User with this email already exists', data: null });
        }

        const verificationCode = generateVerificationCode();

        // Create user with plain password; pre-save hook will hash it
        const user = new User({
            name,
            email,
            password, // Plain password
            profilePicture: req.body.profilePicture || '',
            emailVerified: false,
            verificationToken: verificationCode,
            role: role || 'user',
            adminRole: role === 'admin' ? adminRole : undefined,
            verificationTokenExpires: Date.now() + 15 * 60 * 1000
        });

        await user.save();

        // Send verification email
        try {
            await sendVerificationEmail(email, verificationCode);
        } catch (emailError) {
            await User.findByIdAndDelete(user._id);
            console.error('Email sending failed:', emailError);
            return res.status(500).json({ status: 'error', message: 'Failed to send verification email', data: null });
        }

        // Prepare safe response
        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.verificationToken;
        delete userResponse.verificationTokenExpires;

        console.log(`User created: ${email}`);
        return res.status(201).json({
            status: 'success',
            message: 'User created successfully. Please check your email for verification.',
            data: { user: userResponse }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error', data: null });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(email);
        // Input validation
        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Email and password are required', data: null });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials', data: null });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials', data: null });
        }

        // Check verification and ban status
        if (!user.emailVerified) {
            return res.status(403).json({ status: 'error', message: 'Please verify your email before logging in', data: null });
        }
        if (user.isBanned) {
            return res.status(403).json({ status: 'error', message: 'Your account has been banned', data: null });
        }

        // Generate JWT token
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '100h' });

        // Prepare safe response
        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.verificationToken;
        delete userResponse.verificationTokenExpires;

        console.log(`User logged in: ${email}`);
        return res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: { user: userResponse, token } // Include token in response
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error', data: null });
    }
};
// Verify Email
const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({ status: 'error', message: 'Email and verification code are required', data: null });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found', data: null });
        }

        if (user.emailVerified) {
            return res.status(400).json({ status: 'error', message: 'Email already verified', data: null });
        }

        if (user.verificationToken !== code || Date.now() > user.verificationTokenExpires) {
            return res.status(400).json({ status: 'error', message: 'Invalid or expired verification code', data: null });
        }

        user.emailVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        console.log(`Email verified: ${email}`);
        return res.status(200).json({
            status: 'success',
            message: 'Email verified successfully',
            data: { user: userResponse }
        });
    } catch (error) {
        console.error('Error verifying email:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error', data: null });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ status: 'error', message: 'Email is required', data: null });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found', data: null });
        }

        const otp = generateVerificationCode();

        user.resetToken = otp; // Plain OTP; pre-save hook will hash it
        user.resetTokenExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendResetPasswordEmail(email, otp);
        console.log(`Reset password OTP sent to: ${email}`);

        return res.status(200).json({
            status: 'success',
            message: 'Verification code sent to email',
            data: null
        });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error', data: null });
    }
};

// Verify OTP
const verifyResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({ status: 'error', message: 'Email and verification code are required', data: null });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found', data: null });
        }

        if (!user.resetToken || Date.now() > user.resetTokenExpires) {
            return res.status(400).json({ status: 'error', message: 'Invalid or expired verification code', data: null });
        }

        const isOtpValid = await bcrypt.compare(code, user.resetToken);
        if (!isOtpValid) {
            return res.status(400).json({ status: 'error', message: 'Invalid verification code', data: null });
        }

        return res.status(200).json({
            status: 'success',
            message: 'OTP verified successfully',
            data: null
        });
    } catch (error) {
        console.error('Error in verifyResetCode:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error', data: null });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({ status: 'error', message: 'Email, verification code, and new password are required', data: null });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found', data: null });
        }

        if (!user.resetToken || Date.now() > user.resetTokenExpires) {
            return res.status(400).json({ status: 'error', message: 'Invalid or expired verification code', data: null });
        }

        const isOtpValid = await bcrypt.compare(code, user.resetToken);
        if (!isOtpValid) {
            return res.status(400).json({ status: 'error', message: 'Invalid verification code', data: null });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ status: 'error', message: 'Password must meet complexity requirements', data: null });
        }

        user.password = newPassword; // Plain password; pre-save hook will hash it
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();

        console.log(`Password reset successful for: ${email}`);
        return res.status(200).json({
            status: 'success',
            message: 'Password reset successfully',
            data: null
        });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error', data: null });
    }
};

module.exports = {
    createUser,
    verifyEmail,
    loginUser,
    verifyResetCode,
    forgotPassword,
    resetPassword
};
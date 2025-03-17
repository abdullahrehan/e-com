const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema (merged with Admin functionality)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters']
  },
  profilePicture: {
    type: {
      original: { type: String, default: null },
      thumbnail: { type: String, default: null },
      blurred: { type: String, default: null },
    },
    default: { original: null, thumbnail: null, blurred: null },
  },
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
  securityQuestions: [{
    question: String,
    answer: { type: String, required: true } // Answers will be hashed
  }],
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
  paymentMethods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  adminRole: { type: String, enum: ['Super Admin', 'Inventory Manager', 'Customer Support'] },
  isBanned: { type: Boolean, default: false },
  resetToken: { type: String }, // Will be hashed
  resetTokenExpires: { type: Date }
}, { timestamps: true });

// Hash password, security question answers, and resetToken before saving
UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10);

  // Hash password if modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Hash security question answers if provided and modified
  if (this.securityQuestions && this.securityQuestions.length > 0) {
    for (let q of this.securityQuestions) {
      if (q.answer && this.isModified(`securityQuestions.${this.securityQuestions.indexOf(q)}.answer`)) {
        q.answer = await bcrypt.hash(q.answer, salt);
      }
    }
  }

  // Hash resetToken if modified
  if (this.isModified('resetToken') && this.resetToken) {
    this.resetToken = await bcrypt.hash(this.resetToken, salt);
  }

  next();
});

module.exports = mongoose.model('User', UserSchema);
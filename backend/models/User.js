const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, default: 'customer' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  coins:{type:Number,default:0}
});

module.exports = mongoose.model('User', userSchema);

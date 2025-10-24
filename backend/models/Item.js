const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  price: {
    type: Number,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  image: {
    type: String, // Now stores an image URL
    required: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  category: {
    type: String,
    trim: true,
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  isPurchased: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Item", itemSchema);

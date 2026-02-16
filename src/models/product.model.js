const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    description: {
      type: String,
      trim: true
    },

    brand: {
      type: String,
      index: true
    },

    category: {
      type: String,
      enum: ["mobile", "laptop", "accessory", "headphone", "tablet"],
      index: true
    },

    price: {
      type: Number,
      required: true,
      index: true
    },

    mrp: {
      type: Number
    },

    currency: {
      type: String,
      default: "INR"
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },

    ratingCount: {
      type: Number,
      default: 0
    },

    unitsSold: {
      type: Number,
      default: 0
    },

    returnRate: {
      type: Number,
      default: 0
    },

    complaintCount: {
      type: Number,
      default: 0
    },

    stock: {
      type: Number,
      default: 0
    },

    metadata: {
      ram: String,
      storage: String,
      color: { type: String, index: true },
      screenSize: String,
      brightness: String,
      displayType: String,
      soundOutput: String
    }
  },
  { timestamps: true }
);


// Creating text index for full-text search on title, description, and brand fields
productSchema.index({ title: "text", description: "text", brand: "text" });

module.exports = mongoose.model("Product", productSchema);
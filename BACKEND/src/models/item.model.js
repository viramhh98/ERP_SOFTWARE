const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  sku: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },

  unit: {
    type: String,
    enum: ["pcs", "kg", "liter", "box"],
    required: true
  },

  sellingPrice: {
    type: Number,
    default: 0,
    min: 0
  },

  costPrice: {
    type: Number,
    default: 0,
    min: 0
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

},
{ timestamps: true }
);

itemSchema.index({ sku: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model("Item", itemSchema);
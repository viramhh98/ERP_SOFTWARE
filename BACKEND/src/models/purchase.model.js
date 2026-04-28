const mongoose = require("mongoose");
const purchaseSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },

  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },

  partyId: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },

  purchaseNumber: {
    type: String,
    required: true
  },

  purchaseDate: {
    type: Date,
    default: Date.now
  },

  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },

      quantity: { type: Number, required: true, min: 1 },

      price: { type: Number, required: true, min: 0 },

      total: { type: Number, required: true, min: 0 }
    }
  ],

  totalAmount: { type: Number, required: true, min: 0 },

  
  paymentMode: {
    type: String,
    enum: ["cash", "credit"],
    default: "credit"
  },

  status: {
    type: String,
    enum: ["PENDING", "PAID", "PARTIAL"],
    default: "PENDING"
  }

}, { timestamps: true });

purchaseSchema.index({ companyId: 1, branchId: 1 });

module.exports = mongoose.model("Purchase", purchaseSchema);
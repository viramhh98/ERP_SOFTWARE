const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
  partyId: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },

  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },

  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },

  type: {
    type: String,
    enum: ["DEBIT", "CREDIT"],
    required: true
  },

  amount: { type: Number, required: true, min: 0 },

  referenceType: {
    type: String,
    enum: ["SALE", "PURCHASE", "PAYMENT", "RECEIPT"],
    required: true
  },

  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  description: String

}, { timestamps: true });

ledgerSchema.index({ partyId: 1, companyId: 1 });


module.exports = mongoose.model("Ledger", ledgerSchema);



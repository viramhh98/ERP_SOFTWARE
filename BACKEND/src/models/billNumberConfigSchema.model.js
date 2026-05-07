const mongoose = require("mongoose");

const billNumberConfigSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    voucherType: {
      type: String,
      required: true,
      enum: [
        "Sales Invoice",
        "Purchase Invoice",
        "Debit Note",
        "Credit Note",
        "Quotation",
      ],
    },

    prefix: {
      type: String,
      default: "",
      trim: true,
    },

    suffix: {
      type: String,
      default: "",
      trim: true,
    },

    separator: {
      type: String,
      default: "/",
    },

    financialYear: {
      type: String,
      required: true,
      // Example: 2026-27
    },

    branchCode: {
      type: String,
      default: "",
      uppercase: true,
      trim: true,
    },

    companyCode: {
      type: String,
      default: "",
      uppercase: true,
      trim: true,
    },

    includeFY: {
      type: Boolean,
      default: true,
    },

    includeBranch: {
      type: Boolean,
      default: true,
    },

    includeMonth: {
      type: Boolean,
      default: false,
    },

    resetEveryFY: {
      type: Boolean,
      default: true,
    },

    autoGenerate: {
      type: Boolean,
      default: true,
    },

    startingNumber: {
      type: Number,
      default: 1,
    },

    currentSequence: {
      type: Number,
      default: 1,
    },

    numberPadding: {
      type: Number,
      default: 4,
      // Example:
      // 4 => 0001
      // 5 => 00001
    },

    lastGeneratedBillNo: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ---------------- INDEXES ---------------- */

// One config per branch + voucher type + FY

billNumberConfigSchema.index(
  {
    companyId: 1,
    branchId: 1,
    voucherType: 1,
    financialYear: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "BillNumberConfig",
  billNumberConfigSchema
);
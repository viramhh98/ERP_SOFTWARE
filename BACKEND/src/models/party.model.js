const mongoose = require("mongoose");

const partySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["customer", "supplier", "both"],
      required: true
    },

    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: String,
    address: String,

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    }
  },
  { timestamps: true }
);

partySchema.index({ companyId: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model("Party", partySchema);
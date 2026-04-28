const mongoose = require("mongoose");
const stockSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },

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

    quantity: { type: Number, default: 0 ,min : 0},
  },
  { timestamps: true }
);

stockSchema.index({ itemId: 1, branchId: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model("Stock", stockSchema);
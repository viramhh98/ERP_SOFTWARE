// each company can have multiple branches, and each branch can have its own set of users
//roles will same across branches but users can be assigned to different branches and have different roles in each branch

const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

branchSchema.index({ companyId: 1, name: 1 }, { unique: true });
const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;

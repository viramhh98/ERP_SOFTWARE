//company model where we will store the details of the company like name, gst number, address and pan number
// user will be to create multiple companies
// multiple users can be owner of the same company

const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gstNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    panNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    owners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);


const Company = mongoose.model("Company", CompanySchema);

module.exports = Company;

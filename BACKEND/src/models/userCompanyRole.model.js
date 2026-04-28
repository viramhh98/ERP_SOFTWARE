// policybased access control system for ERP rules and permissions management
// UserCompanyRole model definition using Mongoose
// This model links users to roles within a specific company and branch
// It enables multi-tenant support where a user can have different roles across companies.


// The `limits` field defines business constraints (not permissions),
// such as maximum discount allowed or maximum approval amount.
// These limits are enforced at runtime to control user actions within the system.

const mongoose = require("mongoose");

const userCompanyRoleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  branchId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    default: null, // null means the role applies to all branches of the company
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  limits: {
    sales: {
      maxDiscountPercent: { type: Number, default: 0 },
    },
    approval: {
      maxApprovalAmount: { type: Number, default: 0 },
    },
  },
}, { timestamps: true });

userCompanyRoleSchema.index({ userId: 1, companyId: 1, branchId: 1 }, { unique: true });

module.exports = mongoose.model("UserCompanyRole", userCompanyRoleSchema);
const Company = require("../models/company.model");
const Role = require("../models/role.model");
const UserCompanyRole = require("../models/userCompanyRole.model");

const createCompany = async (data, userId) => {
  // 1. Create company
  const company = await Company.create({
    ...data,
    owners: [userId]
  });

  // 2. Create OWNER role
  const ownerRole = await Role.create({
    name: "OWNER",
    companyId: company._id,
    permissions: [
      {
        module: "all",
        actions: ["create", "read", "update", "delete", "approve"]
      }
    ]
  });

  // 3. Assign role to user
  await UserCompanyRole.create({
    userId,
    companyId: company._id,
    branchId: null,
    roleId: ownerRole._id,
    limits: {}
  });

  return company;
};

const getCompanies = async (userId) => {
  // Find all company roles for the user
  const userRoles = await UserCompanyRole.find({ userId }).populate('companyId');
  // Extract unique companies
  const companies = userRoles.map(ur => ur.companyId);
  return companies;
}


const updateCompany = async (companyId, userId, data) => {
  // Check if user has permission to update company (e.g., is OWNER)
  const userRole = await UserCompanyRole.findOne({ userId, companyId }).populate('roleId');
  if (!userRole || userRole.roleId.name !== "OWNER") {
    throw new Error("Unauthorized");
  }
  // Update company
  const company = await Company.findByIdAndUpdate(companyId, data, { new: true });
  return company;
};

const deleteCompany = async (companyId, userId) => {
  // Check if user has permission to delete company (e.g., is OWNER)
  const userRole = await UserCompanyRole.findOne({ userId, companyId }).populate('roleId');
  if (!userRole || userRole.roleId.name !== "OWNER") {
    throw new Error("Unauthorized");
  }
  // Delete company
  await Company.findByIdAndDelete(companyId);

};


module.exports = { createCompany, getCompanies, updateCompany, deleteCompany };
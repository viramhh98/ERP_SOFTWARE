const Branch = require("../models/branch.model");
const UserCompanyRole = require('../models/userCompanyRole.model')



// Service ko data as parameters lene chahiye, req/res nahi
const createBranch = async ({ name, address, userId, activeCompanyId, activeBranchId }) => {
  
  // 1. Nayi Branch create karein
  const newBranch = await Branch.create({ 
    name, 
    address, 
    companyId: activeCompanyId 
  });

  // 2. Role decide karne ka logic
  let roleMapping = await UserCompanyRole.findOne({ 
    userId, 
    companyId: activeCompanyId, 
    branchId: null 
  }).populate('roleId');

  if (!roleMapping && activeBranchId) {
    roleMapping = await UserCompanyRole.findOne({ 
      userId, 
      companyId: activeCompanyId, 
      branchId: activeBranchId 
    }).populate('roleId');
  }

  // 3. Mapping insert karein
  if (roleMapping) {
    await UserCompanyRole.create({
      userId,
      companyId: activeCompanyId,
      branchId: newBranch._id,
      roleId: roleMapping.roleId._id,
      limits: roleMapping.limits
    });
  }

  return newBranch; // Sirf data return karein, res.status nahi
};


const getBranchesByCompany = async (companyId) => {
  return await Branch.find({ companyId });
};

module.exports = {
  createBranch,
  getBranchesByCompany
};
const UserCompanyRole = require("../models/userCompanyRole.model");

const getUserRoleContext = async ({ userId, companyId, branchId }) => {
  // 1. Try branch-specific role
  let userRole = await UserCompanyRole.findOne({
    userId,
    companyId,
    branchId
  }).populate("roleId");

  // 2. Fallback to global role
  if (!userRole) {
    userRole = await UserCompanyRole.findOne({
      userId,
      companyId,
      branchId: null
    }).populate("roleId");
  }

  return userRole;
};

const getallCompanyBranchesService = async ({ userId }) => {
  // Added branchId to populate
  const allcompanyBranches = await UserCompanyRole.find({ userId })
    .populate("companyId", "name") // Fetch only name from Company
    .populate("branchId", "name"); // Fetch only name from Branch
  return allcompanyBranches;
};


const getUserByRoleService = async ({ companyId, roleId }) => {
  const usersMappings = await UserCompanyRole.find({
    companyId,
    roleId
  })
  .populate("userId", "name email") // Sirf zaroori fields populate karein (password hide rahega)
  .lean();

  // Unique Users filter karne ka logic
  const uniqueUsers = [];
  const seenUserIds = new Set();

  for (const mapping of usersMappings) {
    const user = mapping.userId;
    if (user && !seenUserIds.has(user._id.toString())) {
      seenUserIds.add(user._id.toString());
      uniqueUsers.push({
        id: user._id,
        name: user.name,
        email: user.email
      });
    }
  }

  return uniqueUsers;
};

const updateUserRoleService = async ({ userId, companyId, curr_roleId, new_roleId }) => {
  const result = await UserCompanyRole.updateMany(
    { 
      userId, 
      companyId, 
      roleId: curr_roleId 
    },
    { 
      $set: { roleId: new_roleId } 
    }
  );
  return result; 
};


const getUserByCompanyBranchService = async ({ companyId, branchId }) => {
  const query = { companyId };
  if (branchId && branchId !== 'all') query.branchId = branchId;

  const usersMappings = await UserCompanyRole.find(query)
    .populate("userId", "name email")
    .populate("roleId", "name")
    .populate("branchId", "name")
    .lean();

  const userMap = new Map();

  for (const mapping of usersMappings) {
    const user = mapping.userId;
    if (!user) continue;

    const userIdStr = user._id.toString();

    if (!userMap.has(userIdStr)) {
      userMap.set(userIdStr, {
        id: userIdStr, // Convert ObjectId to String for Frontend
        name: user.name,
        email: user.email,
        assignments: []
      });
    }

    // Push clean strings to assignments
    userMap.get(userIdStr).assignments.push({
      branch: mapping.branchId?.name || "null",
      role: mapping.roleId?.name || "No Role",
      mappingId: mapping._id.toString() // Useful for unique React keys
    });
  }

  // Convert Map to Array so Frontend can use .map()
  const finalResult = Array.from(userMap.values());
  
  
  return finalResult;
};


module.exports ={getUserRoleContext,getallCompanyBranchesService,getUserByRoleService,updateUserRoleService,getUserByCompanyBranchService};
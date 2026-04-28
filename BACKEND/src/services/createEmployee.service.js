const User = require("../models/user.model");
const UserCompanyRole = require("../models/userCompanyRole.model");
const bcrypt = require("bcrypt");
const Role = require("../models/role.model");

const createEmployee = async (data) => {
  const { name, email, password, companyId, assignments } = data;

  // 1️⃣ remove duplicates
  const roleIds = [...new Set(assignments.map((a) => a.roleId))];

  // 2️⃣ fetch roles
  const roles = await Role.find({
    _id: { $in: roleIds },
    companyId,
  });

  // 3️⃣ validate
  if (roles.length !== roleIds.length) {
    throw new Error("One or more roles do not belong to this company");
  }

  // 2️⃣ Find or create user
  let user = await User.findOne({ email });

  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
  }

  // 3️⃣ Prepare bulk insert data
  const rolesData = assignments.map(({ branchId, roleId }) => ({
    userId: user._id,
    companyId,
    branchId,
    roleId,
    limits: {},
  }));

  // 4️⃣ Insert (skip duplicates)
  await UserCompanyRole.insertMany(rolesData, { ordered: false });

  return {
    user,
    assignedCount: rolesData.length,
  };
};

module.exports = {
  createEmployee,
};

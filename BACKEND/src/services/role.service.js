const Role = require("../models/role.model");

const createRole = async ({ name, permissions, companyId }) => {
  const role = await Role.create({
    name:name.toUpperCase(),
    permissions,
    companyId
  });

  return role;
};
const deleteRole = async ({ roleId, companyId }) => {
  const deletedRole = await Role.findOneAndDelete({ _id: roleId, companyId });
  return deletedRole;
}


module.exports = {
  createRole,
  deleteRole
};
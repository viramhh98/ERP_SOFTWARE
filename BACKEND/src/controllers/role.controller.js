const roleService = require("../services/role.service");

const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const  companyId  = req.user.activeCompanyId;
    const role = await roleService.createRole({
      name,
      permissions,
      companyId
    });

    res.status(201).json(role);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Role already exists for this company"
      });
    }

    res.status(500).json({ message: "Error creating role", error: error.message });
  }
};


const Role = require("../models/role.model");

const getRolesByCompany = async (req, res) => {
  try {

    const activeCompanyId= req.user.activeCompanyId;
    const roles = await Role.find({ companyId: activeCompanyId });

    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching roles" });
  }
};


const deleteRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const activeCompanyId= req.user.activeCompanyId;
    const deletedRole = await roleService.deleteRole({ roleId, companyId: activeCompanyId });
    res.json(deletedRole);  
  } catch (error) {
    res.status(500).json({ message: "Error deleting role", error: error.message });
  }
};


module.exports = {
  createRole,
  getRolesByCompany,
  deleteRole
};

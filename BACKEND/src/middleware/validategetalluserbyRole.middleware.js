const validategetalluserbyRole = (req, res, next) => {
  const RoleId = req.params.roleId;
  
  const companyId = req.user.activeCompanyId;
  if (!RoleId || !companyId) {
    return res.status(400).json({
      error: "Role ID and company ID required"
    });
  }
  next();
};


const validateupdateUserRole = (req, res, next) => {
  const { userId,  curr_roleId, new_roleId } = req.body;
  const companyId = req.user.activeCompanyId;
  if (!userId || !companyId || !curr_roleId || !new_roleId) {
    return res.status(400).json({
      error: "userId, companyId, curr_roleId and new_roleId are required"
    });
  }
  next();
}

module.exports = {validategetalluserbyRole, validateupdateUserRole};
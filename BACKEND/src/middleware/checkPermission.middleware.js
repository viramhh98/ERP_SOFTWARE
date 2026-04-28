// middlewares/checkPermission.js

const { getUserRoleContext } = require("../services/userCompanyRole.service");

const checkPermission = (module, action = null) => {
  return async (req, res, next) => {
    try {
      const { userId, activeCompanyId, activeBranchId } = req.user;

     

      const roleContext = await getUserRoleContext({
        userId,
        companyId: activeCompanyId,
        branchId: activeBranchId,
      });

      if (!roleContext || !roleContext.roleId) {
        return res.status(403).json({ message: "No role assigned" });
      }

      const role = roleContext.roleId;

      const permissions = role.permissions || [];

      // ✅ Exact module match
      const modulePermission = permissions.find(
        (p) => p.module === module
      );

      // 🔥 "ALL" module support
      const allPermission = permissions.find(
        (p) => p.module === "all"
      );

      if (!modulePermission && !allPermission) {
        return res.status(403).json({
          message: `Access denied for module: ${module}`,
        });
      }

      // final permission decide
      const finalPermission = modulePermission || allPermission;

      // ✅ Action check
      if (action && !finalPermission.actions.includes(action)) {
        return res.status(403).json({
          message: `Access denied for ${module}:${action}`,
        });
      }

      // attach for controller use
      req.roleContext = roleContext;

      return next();

    } catch (error) {
      return res.status(500).json({
        message: "Permission check failed",
      });
    }
  };
};

module.exports = checkPermission;
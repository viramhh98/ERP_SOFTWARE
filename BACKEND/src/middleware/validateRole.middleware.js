const ALLOWED_MODULES = [
  "all", // 🔥 Added for Super Admin/Owner support
  "dashboard",
  "sales",
  "purchase",
  "inventory",
  "finance",
  "users", // Consistent with your Sidebar names
  "branchmanagement",
  "settings"
];

const ALLOWED_ACTIONS = [
  "create",
  "read",
  "update",
  "delete",
  "approve",
  "discount",
  "refund",
  "report",
  "print"
];

const validateCreateRole = (req, res, next) => {
  const { name, permissions } = req.body;

  // 1. Basic Name Check
  if (!name || typeof name !== 'string' || name.trim() === "") {
    return res.status(400).json({ message: "A valid Role name is required" });
  }

  // 2. Permissions Array Check
  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
    return res.status(400).json({ message: "At least one module permission is required" });
  }

  // 3. Deep Validation
  for (const perm of permissions) {
    // Check if module exists
    if (!ALLOWED_MODULES.includes(perm.module)) {
      return res.status(400).json({
        message: `Invalid module: ${perm.module}. Allowed: ${ALLOWED_MODULES.join(", ")}`
      });
    }

    // Check if actions array exists and is valid
    if (!perm.actions || !Array.isArray(perm.actions) || perm.actions.length === 0) {
      return res.status(400).json({
        message: `At least one action is required for module: ${perm.module}`
      });
    }

    for (const action of perm.actions) {
      if (!ALLOWED_ACTIONS.includes(action)) {
        return res.status(400).json({
          message: `Invalid action: '${action}' in module '${perm.module}'`
        });
      }
    }
  }

  next();
};

module.exports = { validateCreateRole };

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleController = require("../controllers/role.controller");
const validateRole = require("../middleware/validateRole.middleware");
const activeCompanyMiddleware = require("../middleware/activeCompany.middleware");
const checkPermission = require("../middleware/checkPermission.middleware");
// create role for a company
router.post(
  "/",
  authMiddleware,
  validateRole.validateCreateRole,
  activeCompanyMiddleware,
  checkPermission("RoleManagement","create"),
  roleController.createRole
);

// get all roles for a company
router.get(
  "/",
  authMiddleware,
  activeCompanyMiddleware,
  roleController.getRolesByCompany
);

router.delete(
  "/:roleId",
  authMiddleware,
  activeCompanyMiddleware,
  checkPermission("RoleManagement","delete"),
  roleController.deleteRole
);



module.exports = router;
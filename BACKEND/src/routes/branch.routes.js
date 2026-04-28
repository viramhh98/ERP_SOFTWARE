const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const { validateCreateBranch } = require("../middleware/validateBranch.middleware");
const branchController = require("../controllers/branch.controller");
const activeCompanyMiddleware = require("../middleware/activeCompany.middleware");
const checkPermission = require("../middleware/checkPermission.middleware");
const activeBranchMiddleware = require("../middleware/activeBranch.middleware");


// Create branch
router.post(
  "/",
  authMiddleware,
  activeCompanyMiddleware,
  activeBranchMiddleware,
  checkPermission("branchManagement", "create"),
  validateCreateBranch,
  branchController.createBranch
);

// Get all branches by company
router.get(
  "/:companyId",
  authMiddleware,
  branchController.getBranches
);

module.exports = router;
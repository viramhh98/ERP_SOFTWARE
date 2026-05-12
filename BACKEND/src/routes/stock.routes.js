const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stock.controller");
const authMiddleware = require("../middleware/auth.middleware");
const activeCompanyMiddleware = require("../middleware/activeCompany.middleware");
const activeBranchMiddleware = require("../middleware/activeBranch.middleware");

// Get current inventory status
router.get(
  "/",
  authMiddleware,
  activeCompanyMiddleware,
  activeBranchMiddleware,
  stockController.getCurrentStock
);

router.get(
  "/sales-report",
  authMiddleware,
  activeCompanyMiddleware,
  activeBranchMiddleware,
  stockController.getSalesReport
);

module.exports = router;

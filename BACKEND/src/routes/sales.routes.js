const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const activeCompanyMiddleware = require("../middleware/activeCompany.middleware");
const activeBranchMiddleware = require("../middleware/activeBranch.middleware");

const saleController = require("../controllers/sale.controller");
const { validateCreateSale } = require("../middleware/validateSale.middleware");

router.post(
  "/",
  authMiddleware,
  activeCompanyMiddleware,
  activeBranchMiddleware,
  validateCreateSale,
  saleController.createSale
);

router.get("/", authMiddleware, activeCompanyMiddleware, activeBranchMiddleware, saleController.getSalesHistory);

module.exports = router;
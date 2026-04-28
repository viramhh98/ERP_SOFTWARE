const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const activeCompanyMiddleware = require("../middleware/activeCompany.middleware");
const activeBranchMiddleware = require("../middleware/activeBranch.middleware");
const purchaseController = require("../controllers/purchase.controller");
const { validateCreatePurchase} = require("../middleware/validatePurchase.middleware");

router.post(
  "/",
  authMiddleware,
  activeCompanyMiddleware,
  activeBranchMiddleware,
  validateCreatePurchase,
  purchaseController.createPurchase
);

router.get(
  "/",
  authMiddleware,
  activeCompanyMiddleware,
  activeBranchMiddleware,
  purchaseController.getPurchases
);

router.get( 
  "/:id",
  authMiddleware,
  activeCompanyMiddleware,
  activeBranchMiddleware,
  purchaseController.getPurchaseById
);


module.exports = router;

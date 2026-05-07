// const express = require("express");
// const router = express.Router();

// const authMiddleware = require("../middleware/auth.middleware");
// const activeCompanyMiddleware = require("../middleware/activeCompany.middleware");
// const activeBranchMiddleware = require("../middleware/activeBranch.middleware");
// const purchaseController = require("../controllers/purchase.controller");
// const { validateCreatePurchase} = require("../middleware/validatePurchase.middleware");

// router.post(
//   "/",
//   authMiddleware,
//   activeCompanyMiddleware,
//   activeBranchMiddleware,
//   validateCreatePurchase,
//   purchaseController.createPurchase
// );

// router.get(
//   "/",
//   authMiddleware,
//   activeCompanyMiddleware,
//   activeBranchMiddleware,
//   purchaseController.getPurchases
// );

// router.get(
//   "/:id",
//   authMiddleware,
//   activeCompanyMiddleware,
//   activeBranchMiddleware,
//   purchaseController.getPurchaseById
// );

// module.exports = router;

// routes/purchase.routes.js

const express = require("express");

const router = express.Router();

/* -------------------------------------------- */
/* MIDDLEWARES */
/* -------------------------------------------- */

const authMiddleware = require("../middleware/auth.middleware");

const activeCompanyMiddleware = require("../middleware/activeCompany.middleware");

const activeBranchMiddleware = require("../middleware/activeBranch.middleware");

/* -------------------------------------------- */
/* VALIDATION */
/* -------------------------------------------- */

const {
  validateCreatePurchase,
} = require("../middleware/validatePurchase.middleware");

/* -------------------------------------------- */
/* CONTROLLER */
/* -------------------------------------------- */

const purchaseController = require("../controllers/purchase.controller");

/* -------------------------------------------- */
/* CREATE PURCHASE */
/* -------------------------------------------- */

router.post(
  "/",

  authMiddleware,

  activeCompanyMiddleware,

  activeBranchMiddleware,

  validateCreatePurchase,

  purchaseController.createPurchase
);

/* -------------------------------------------- */
/* GET ALL PURCHASES */
/* -------------------------------------------- */

router.get(
  "/",

  authMiddleware,

  activeCompanyMiddleware,

  activeBranchMiddleware,

  purchaseController.getPurchases
);

/* -------------------------------------------- */
/* GET PURCHASE BY ID */
/* -------------------------------------------- */

router.get(
  "/:id",

  authMiddleware,

  activeCompanyMiddleware,

  activeBranchMiddleware,

  purchaseController.getPurchaseById
);

module.exports = router;

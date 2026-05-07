// routes/billNumber.routes.js

const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const activeCompany = require("../middleware/activeCompany.middleware");
const activeBranch = require("../middleware/activeBranch.middleware");

const {
  generateBillNumberController,

  createOrUpdateBillConfigController,

  getBillNumberConfigController,
} = require("../controllers/billNumber.controller");
/* -------------------------------------------- */
/* GENERATE BILL NUMBER */
/* -------------------------------------------- */

router.post(
  "/generate",

  authMiddleware,

  activeCompany,

  activeBranch,

  generateBillNumberController
);

/* -------------------------------------------- */
/* CREATE / UPDATE CONFIG */
/* -------------------------------------------- */

router.post(
  "/config",

  authMiddleware,

  activeCompany,

  activeBranch,

  createOrUpdateBillConfigController
);

/* -------------------------------------------- */
/* GET CONFIG */
/* -------------------------------------------- */

router.get(
  "/config",

  authMiddleware,

  activeCompany,

  activeBranch,

  getBillNumberConfigController
);

module.exports = router;

const express = require("express");
const router = express.Router();
const ledgerController = require("../controllers/ledger.controller");
const authMiddleware = require("../middleware/auth.middleware");
const activeCompanyMiddleware = require("../middleware/activeCompany.middleware");

// 1. View Ledger
router.get("/:partyId", authMiddleware, activeCompanyMiddleware, ledgerController.getPartyLedger);

// 2. Post New Payment (DEBIT Entry)
router.post("/payment", authMiddleware, activeCompanyMiddleware, ledgerController.postPayment);

module.exports = router;

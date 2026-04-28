const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const partyController = require("../controllers/party.controller");
const {validateCreateParty} = require("../middleware/validateParty.middleware");
const activeCompanyMiddleware = require("../middleware/activeCompany.middleware");
const activeBranchMiddleware = require("../middleware/activeBranch.middleware");

// Create party
router.post("/", authMiddleware,activeCompanyMiddleware, activeBranchMiddleware,  validateCreateParty, partyController.createParty);

// Get parties (filter by type optional)
router.get("/filter", authMiddleware, activeCompanyMiddleware, partyController.getParties);

// Get party by phone number
router.get("/phone", authMiddleware, activeCompanyMiddleware, activeBranchMiddleware, partyController.getPartyByPhone);

module.exports = router;

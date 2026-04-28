const express = require("express");
const router = express.Router();

const activeCompanyMiddleware = require("../middleware/activeCompany.middleware");
const activeBranchMiddleware = require("../middleware/activeBranch.middleware");
const checkPermission = require("../middleware/checkPermission.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createCompany,
  getCompanies,
  updateCompany,
  deleteCompany,
} = require("../controllers/company.controller");

// route for creating a company
router.post("/", authMiddleware,checkPermission("companyManagement", "create"), createCompany);

// route for fetching companies
router.get("/", authMiddleware, getCompanies);

// update and delete routes can be added similarly, ensuring to use authMiddleware for protection
router.put("/:id", authMiddleware, updateCompany);
router.delete("/:id", authMiddleware, deleteCompany);

module.exports = router;

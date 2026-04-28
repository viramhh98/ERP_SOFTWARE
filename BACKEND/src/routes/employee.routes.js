const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const { validateCreateEmployee } = require("../middleware/validateEmployee.middleware");
const employeeController = require("../controllers/employee.controller");

// Create employee with multiple role assignments
router.post(
  "/",
  authMiddleware,
  validateCreateEmployee,
  employeeController.createEmployee
);

module.exports = router;

module.exports = router;
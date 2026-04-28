const express = require("express");
const router = express.Router();

const activeCompanyMiddleware = require("../middleware/activeCompany.middleware");
const activeBranchMiddleware = require("../middleware/activeBranch.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const {validategetalluserbyRole,validateupdateUserRole} = require("../middleware/validategetalluserbyRole.middleware");
const {getMyRole,getallCompanyBranches,getUserByRole,updateUserRole,getUserByCompanyBranch} = require("../controllers/userCompanyRole.controller");


router.get("/me", authMiddleware,activeCompanyMiddleware, activeBranchMiddleware, getMyRole);
router.get("/allcompanybranches", authMiddleware, getallCompanyBranches);
router.get("/usersbyrole/:roleId", authMiddleware,activeCompanyMiddleware, validategetalluserbyRole, getUserByRole);
router.get("/all-users", authMiddleware,activeCompanyMiddleware,activeBranchMiddleware, getUserByCompanyBranch);

router.post("/update-role", authMiddleware,activeCompanyMiddleware, validateupdateUserRole,  updateUserRole);


module.exports = router;
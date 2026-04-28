const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const activeCompanyMiddleware = require("../middleware/activeCompany.middleware");
const itemController = require("../controllers/item.controller");
const { validateCreateItem } = require("../middleware/validateItems.middleware");

// Create item
router.post(
  "/",
  authMiddleware,
  activeCompanyMiddleware,
  validateCreateItem,
  itemController.createItem
);

// Get all items

router.get("/:id",
  authMiddleware,
  activeCompanyMiddleware,
  itemController.getItemById
);



router.get(
  "/",
  authMiddleware,
  activeCompanyMiddleware,
  itemController.getItems
);

module.exports = router;
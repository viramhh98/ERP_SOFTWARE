const itemService = require("../services/item.services");

const createItem = async (req, res) => {
  try {
    const companyId = req.user.activeCompanyId; // 🔥 from token

    const item = await itemService.createItem({
      ...req.body,
      companyId,
    });

    res.status(201).json({
      message: "Item created successfully",
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error creating item",
    });
  }
};

const getItems = async (req, res) => {
  try {
    const companyId = req.user.activeCompanyId; // 🔥 FIX HERE

    const items = await itemService.getItems(companyId);

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching items",
    });
  }
};

const getItemById = async (req, res) => {
  try {
    const companyId = req.user.activeCompanyId; // Middleware se aa raha hai
    const itemId = req.params.id; // URL path se aa raha hai

    // Service call
    const item = await itemService.getItemById(itemId, companyId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found or unauthorized access",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item details retrieved",
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
};

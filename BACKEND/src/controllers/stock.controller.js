const stockService = require("../services/stock.service");

const getCurrentStock = async (req, res) => {
  try {
    const companyId = req.user.activeCompanyId;
    const branchId = req.user.activeBranchId;

    const inventory = await stockService.getAllStock(companyId, branchId);

    res.status(200).json({
      success: true,
      message: "Inventory status retrieved",
      data: inventory
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCurrentStock };

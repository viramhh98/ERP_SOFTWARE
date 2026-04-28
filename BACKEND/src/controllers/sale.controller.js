const saleService = require("../services/sale.service");

const createSale = async (req, res) => {
  try {
    const companyId = req.user.activeCompanyId;
    const branchId = req.user.activeBranchId;

    const sale = await saleService.createSale({
      ...req.body,
      companyId,
      branchId
    });

    res.status(201).json({
      message: "Sale created successfully",
      data: sale
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Error creating sale"
    });
  }
};


const getSalesHistory = async (req, res) => {
  try {
    const companyId = req.user.activeCompanyId;
    const branchId = req.user.activeBranchId;

    const sales = await saleService.getAllSales(companyId, branchId);

    res.status(200).json({
      success: true,
      message: "Sales history retrieved successfully",
      data: sales
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};




module.exports = {
  createSale,getSalesHistory
};
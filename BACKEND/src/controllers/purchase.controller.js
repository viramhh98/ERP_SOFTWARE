const purchaseService = require("../services/purchase.service");

const createPurchase = async (req, res) => {
  try {
    const companyId = req.user.activeCompanyId;
    const branchId = req.user.activeBranchId;

    const purchase = await purchaseService.createPurchase({
      ...req.body,
      companyId,
      branchId
    });

    res.status(201).json({
      message: "Purchase created successfully",
      data: purchase
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Error creating purchase"
    });
  }
};

const getPurchases = async (req, res) => {
  try {
    const companyId = req.user.activeCompanyId;
    const branchId = req.user.activeBranchId;
    const purchases = await purchaseService.getPurchases({ companyId, branchId });
    res.status(200).json({
      message: "Purchases retrieved successfully",
      data: purchases
    });
  }
  catch (error) {
    res.status(500).json({
      message: error.message || "Error retrieving purchases"
    });
  }
};

const getPurchaseById = async (req, res) => {
  try {
    const companyId = req.user.activeCompanyId;
    const branchId = req.user.activeBranchId;
    const purchaseId = req.params.id;
    const purchase = await purchaseService.getPurchaseById({ companyId, branchId, purchaseId });
    if (!purchase) {
      return res.status(404).json({
        message: "Purchase not found"
      });
    } 
    res.status(200).json({
      message: "Purchase retrieved successfully",
      data: purchase
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Error retrieving purchase"
    });
  }
};

module.exports = {
  createPurchase,
  getPurchases,
  getPurchaseById
};
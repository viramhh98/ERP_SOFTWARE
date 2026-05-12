// const stockService = require("../services/stock.service");
// const StockTransaction = require("../models/StockTransaction.model");

// const getCurrentStock = async (req, res) => {
//   try {
//     const companyId = req.user.activeCompanyId;
//     const branchId = req.user.activeBranchId;

//     const inventory = await stockService.getAllStock(companyId, branchId);

//     res.status(200).json({
//       success: true,
//       message: "Inventory status retrieved",
//       data: inventory
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// module.exports = { getCurrentStock };

const mongoose = require("mongoose");
const stockService = require("../services/stock.service");
const StockTransaction = require("../models/stockTransaction.model");

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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getSalesReport = async (req, res) => {

  try {

    const {
      fromDate,
      toDate,
      itemId
    } = req.query;

    const companyId =
      req.user.activeCompanyId;

    const branchId =
      req.user.activeBranchId;

    const matchStage = {

      companyId:
        new mongoose.Types.ObjectId(
          companyId
        ),

      branchId:
        new mongoose.Types.ObjectId(
          branchId
        ),

      type: "OUT",

      referenceType: "SALE",

      createdAt: {
        $gte: new Date(fromDate),

        $lte: new Date(toDate),
      },
    };

    /* -------------------------------------------- */
    /* OPTIONAL ITEM FILTER */
    /* -------------------------------------------- */

    if (itemId) {

      matchStage.itemId =
        new mongoose.Types.ObjectId(
          itemId
        );
    }

    /* -------------------------------------------- */
    /* AGGREGATION */
    /* -------------------------------------------- */

    const result =
      await StockTransaction.aggregate([

        {
          $match: matchStage,
        },

        /* ITEM DETAILS */
        {
          $lookup: {
            from: "items",

            localField: "itemId",

            foreignField: "_id",

            as: "item",
          },
        },

        {
          $unwind: "$item",
        },

        /* GROUP */
        {
          $group: {

            _id: "$itemId",

            itemName: {
              $first: "$item.name",
            },

            costPrice: {
              $first: "$item.costPrice",
            },

            sellingPrice: {
              $first:
                "$item.sellingPrice",
            },

            totalSold: {
              $sum: "$quantity",
            },
          },
        },

        /* TOTAL SALES */
        {
          $addFields: {

            totalAmount: {
              $multiply: [
                "$totalSold",
                "$sellingPrice",
              ],
            },
          },
        },

        /* FINAL RESPONSE */
        {
          $project: {

            _id: 0,

            itemId: "$_id",

            itemName: 1,

            totalSold: 1,

            costPrice: 1,

            sellingPrice: 1,

            totalAmount: 1,
          },
        },

        /* SORT */
        {
          $sort: {
            totalAmount: -1,
          },
        },
      ]);

    /* -------------------------------------------- */
    /* RESPONSE */
    /* -------------------------------------------- */

    res.status(200).json({
      success: true,

      message:
        "Sales report fetched",

      data: result,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = {
  getCurrentStock,
  getSalesReport
};
// const mongoose = require("mongoose");

// const Sale = require("../models/sale.model");

// const stockService = require("./stock.service");

// const stockTransactionService = require("./stockTransaction.service");

// const ledgerService = require("./ledger.service");

// const { generateBillNumber } = require("./billNumber.service");

// /* ------------------------------------------------ */
// /* CREATE SALE */
// /* ------------------------------------------------ */

// const createSale = async (data) => {
//   const session = await mongoose.startSession();

//   session.startTransaction();

//   try {
//     /* -------------------------------------------- */
//     /* GENERATE BILL NUMBER */
//     /* -------------------------------------------- */

//     const salesNumber = await generateBillNumber({
//       activeCompanyId: data.companyId,

//       activeBranchId: data.branchId,

//       voucherType: "Sales Invoice",
//     });

//     /* -------------------------------------------- */
//     /* NORMALIZE + GROUP ITEMS */
//     /* -------------------------------------------- */

//     const groupedMap = new Map();

//     for (const item of data.items) {
//       const itemId = item.itemId.toString();

//       const quantity = Number(item.quantity);

//       const price = Number(item.price);

//       const total = quantity * price;

//       if (groupedMap.has(itemId)) {
//         const existing = groupedMap.get(itemId);

//         existing.quantity += quantity;

//         existing.total += total;
//       } else {
//         groupedMap.set(itemId, {
//           ...item,

//           quantity,

//           price,

//           total,
//         });
//       }
//     }

//     const items = Array.from(groupedMap.values());
//     /* -------------------------------------------- */
//     /* TOTAL */
//     /* -------------------------------------------- */

//     const totalAmount = items.reduce(
//       (acc, item) => acc + item.total,

//       0
//     );

//     const paidAmount = Number(data.paidAmount || 0);

//     /* -------------------------------------------- */
//     /* VALIDATION */
//     /* -------------------------------------------- */

//     if (paidAmount > totalAmount) {
//       throw new Error("Paid amount cannot exceed total amount");
//     }

//     /* -------------------------------------------- */
//     /* STATUS */
//     /* -------------------------------------------- */

//     let status = "PENDING";

//     if (paidAmount >= totalAmount) {
//       status = "PAID";
//     } else if (paidAmount > 0) {
//       status = "PARTIAL";
//     }

//     /* -------------------------------------------- */
//     /* CREATE SALE */
//     /* -------------------------------------------- */

//     const sale = await Sale.create(
//       [
//         {
//           ...data,

//           salesNumber,

//           items,

//           totalAmount,

//           paidAmount,

//           status,
//         },
//       ],

//       { session }
//     );

//     const saleDoc = sale[0];

//     /* -------------------------------------------- */
//     /* STOCK OUT */
//     /* -------------------------------------------- */

//     for (const item of items) {
//       await stockService.decreaseStock({
//         itemId: item.itemId,

//         companyId: data.companyId,

//         branchId: data.branchId,

//         quantity: item.quantity,

//         session,
//       });

//       await stockTransactionService.createStockTransaction(
//         {
//           itemId: item.itemId,

//           companyId: data.companyId,

//           branchId: data.branchId,

//           type: "OUT",

//           quantity: item.quantity,

//           referenceType: "SALE",

//           referenceId: saleDoc._id,
//         },

//         session
//       );
//     }

//     /* -------------------------------------------- */
//     /* SALES INVOICE ENTRY */
//     /* -------------------------------------------- */

//     await ledgerService.createLedgerEntry(
//       {
//         partyId: data.partyId,

//         companyId: data.companyId,

//         branchId: data.branchId,

//         type: "DEBIT",

//         amount: totalAmount,

//         referenceType: "SALE",

//         referenceId: saleDoc._id,

//         description: `Invoice ${salesNumber} generated for customer sale`,
//       },

//       session
//     );

//     /* -------------------------------------------- */
//     /* PAYMENT RECEIVED */
//     /* -------------------------------------------- */

//     if (paidAmount > 0) {
//       await ledgerService.createLedgerEntry(
//         {
//           partyId: data.partyId,

//           companyId: data.companyId,

//           branchId: data.branchId,

//           type: "CREDIT",

//           amount: paidAmount,

//           referenceType: "RECEIPT",

//           referenceId: saleDoc._id,

//           description: `Payment received against Invoice ${salesNumber} via ${data.paymentMode?.toUpperCase()}`,
//         },

//         session
//       );
//     }

//     /* -------------------------------------------- */
//     /* COMMIT */
//     /* -------------------------------------------- */

//     await session.commitTransaction();

//     session.endSession();

//     return saleDoc;
//   } catch (error) {
//     await session.abortTransaction();

//     session.endSession();

//     throw error;
//   }
// };

// /* ------------------------------------------------ */
// /* GET SALES */
// /* ------------------------------------------------ */

// const getAllSales = async (companyId, branchId) => {
//   try {
//     return await Sale.find({
//       companyId,

//       branchId,
//     })

//       .populate("partyId", "name phone")

//       .populate("items.itemId", "name sku unit")

//       .sort({
//         createdAt: -1,
//       });
//   } catch (error) {
//     throw new Error("Error fetching sales from database");
//   }
// };

// const getSaleById = async (saleId, companyId, branchId) => {
//   try {
//     return await Sale.findOne({
//       _id: saleId,
//       companyId,
//       branchId,
//     })
//       .populate("partyId", "name phone")
//       .populate("items.itemId", "name sku unit");
//   } catch (error) {
//     throw new Error("Error fetching sale from database");
//   }
// };

// module.exports = {
//   createSale,
//   getSaleById,
//   getAllSales,
// };



















// const mongoose = require("mongoose");

// const Sale = require("../models/sale.model");

// const Item = require("../models/item.model");

// const stockService = require("./stock.service");

// const stockTransactionService = require("./stockTransaction.service");

// const ledgerService = require("./ledger.service");

// const { generateBillNumber } = require("./billNumber.service");

// /* ------------------------------------------------ */
// /* CREATE SALE */
// /* ------------------------------------------------ */

// const createSale = async (data) => {
//   const session = await mongoose.startSession();

//   session.startTransaction();

//   try {
//     /* -------------------------------------------- */
//     /* GENERATE BILL NUMBER */
//     /* -------------------------------------------- */

//     const salesNumber = await generateBillNumber({
//       activeCompanyId: data.companyId,

//       activeBranchId: data.branchId,

//       voucherType: "Sales Invoice",
//     });

//     /* -------------------------------------------- */
//     /* NORMALIZE + GROUP ITEMS */
//     /* -------------------------------------------- */

//     const groupedMap = new Map();

//     for (const item of data.items) {
//       const itemId = item.itemId.toString();

//       const quantity = Number(item.quantity);

//       const price = Number(item.price);

//       const total = quantity * price;

//       if (groupedMap.has(itemId)) {
//         const existing = groupedMap.get(itemId);

//         existing.quantity += quantity;

//         existing.total += total;
//       } else {
//         groupedMap.set(itemId, {
//           ...item,

//           quantity,

//           price,

//           total,
//         });
//       }
//     }

//     const items = Array.from(groupedMap.values());

//     /* -------------------------------------------- */
//     /* TOTAL */
//     /* -------------------------------------------- */

//     const totalAmount = items.reduce(
//       (acc, item) => acc + item.total,
//       0
//     );

//     const paidAmount = Number(data.paidAmount || 0);

//     /* -------------------------------------------- */
//     /* VALIDATION */
//     /* -------------------------------------------- */

//     if (paidAmount > totalAmount) {
//       throw new Error("Paid amount cannot exceed total amount");
//     }

//     /* -------------------------------------------- */
//     /* STATUS */
//     /* -------------------------------------------- */

//     let status = "PENDING";

//     if (paidAmount >= totalAmount) {
//       status = "PAID";
//     } else if (paidAmount > 0) {
//       status = "PARTIAL";
//     }

//     /* -------------------------------------------- */
//     /* CREATE SALE */
//     /* -------------------------------------------- */

//     const sale = await Sale.create(
//       [
//         {
//           ...data,

//           salesNumber,

//           items,

//           totalAmount,

//           paidAmount,

//           status,
//         },
//       ],

//       { session }
//     );

//     const saleDoc = sale[0];

//     /* -------------------------------------------- */
//     /* STOCK OUT */
//     /* -------------------------------------------- */

//     for (const item of items) {

//       // fetch actual item
//       const dbItem = await Item.findById(item.itemId);

//       // maintain stock only if enabled
//       if (dbItem?.maintainStock) {

//         await stockService.decreaseStock({
//           itemId: item.itemId,

//           companyId: data.companyId,

//           branchId: data.branchId,

//           quantity: item.quantity,

//           session,
//         });

//         await stockTransactionService.createStockTransaction(
//           {
//             itemId: item.itemId,

//             companyId: data.companyId,

//             branchId: data.branchId,

//             type: "OUT",

//             quantity: item.quantity,

//             referenceType: "SALE",

//             referenceId: saleDoc._id,
//           },

//           session
//         );
//       }
//     }

//     /* -------------------------------------------- */
//     /* SALES INVOICE ENTRY */
//     /* -------------------------------------------- */

//     await ledgerService.createLedgerEntry(
//       {
//         partyId: data.partyId,

//         companyId: data.companyId,

//         branchId: data.branchId,

//         type: "DEBIT",

//         amount: totalAmount,

//         referenceType: "SALE",

//         referenceId: saleDoc._id,

//         description: `Invoice ${salesNumber} generated for customer sale`,
//       },

//       session
//     );

//     /* -------------------------------------------- */
//     /* PAYMENT RECEIVED */
//     /* -------------------------------------------- */

//     if (paidAmount > 0) {
//       await ledgerService.createLedgerEntry(
//         {
//           partyId: data.partyId,

//           companyId: data.companyId,

//           branchId: data.branchId,

//           type: "CREDIT",

//           amount: paidAmount,

//           referenceType: "RECEIPT",

//           referenceId: saleDoc._id,

//           description: `Payment received against Invoice ${salesNumber} via ${data.paymentMode?.toUpperCase()}`,
//         },

//         session
//       );
//     }

//     /* -------------------------------------------- */
//     /* COMMIT */
//     /* -------------------------------------------- */

//     await session.commitTransaction();

//     session.endSession();

//     return saleDoc;

//   } catch (error) {

//     await session.abortTransaction();

//     session.endSession();

//     throw error;
//   }
// };

// /* ------------------------------------------------ */
// /* GET SALES */
// /* ------------------------------------------------ */

// const   getAllSales = async (companyId, branchId) => {
//   try {
//     return await Sale.find({
//       companyId,

//       branchId,
//     })

//       .populate("partyId", "name phone")

//       .populate(
//         "items.itemId",
//         "name sku unit maintainStock"
//       )

//       .sort({
//         createdAt: -1,
//       });

//   } catch (error) {
//     throw new Error("Error fetching sales from database");
//   }
// };

// const getSaleById = async (
//   saleId,
//   companyId,
//   branchId
// ) => {
//   try {
//     return await Sale.findOne({
//       _id: saleId,

//       companyId,

//       branchId,
//     })

//       .populate("partyId", "name phone")

//       .populate(
//         "items.itemId",
//         "name sku unit maintainStock"
//       );

//   } catch (error) {
//     throw new Error("Error fetching sale from database");
//   }
// };

// module.exports = {
//   createSale,

//   getSaleById,

//   getAllSales,
// };
























const mongoose = require("mongoose");

const Sale = require("../models/sale.model");
const Item = require("../models/item.model");

const stockService = require("./stock.service");
const stockTransactionService = require("./stockTransaction.service");
const ledgerService = require("./ledger.service");

const { generateBillNumber } = require("./billNumber.service");

/* ------------------------------------------------ */
/* CREATE SALE */
/* ------------------------------------------------ */

const createSale = async (data) => {

  const session = await mongoose.startSession();

  session.startTransaction();

  try {

    /* -------------------------------------------- */
    /* GENERATE BILL NUMBER */
    /* -------------------------------------------- */

    const salesNumber = await generateBillNumber({
      activeCompanyId: data.companyId,
      activeBranchId: data.branchId,
      voucherType: "Sales Invoice",
    });

    /* -------------------------------------------- */
    /* NORMALIZE + GROUP ITEMS */
    /* -------------------------------------------- */

    const groupedMap = new Map();

    for (const item of data.items) {

      const itemId = item.itemId.toString();

      const quantity = Number(item.quantity);

      const price = Number(item.price);

      const total = quantity * price;

      if (groupedMap.has(itemId)) {

        const existing = groupedMap.get(itemId);

        existing.quantity += quantity;

        existing.total += total;

      } else {

        groupedMap.set(itemId, {
          ...item,
          quantity,
          price,
          total,
        });
      }
    }

    const items = Array.from(groupedMap.values());

    /* -------------------------------------------- */
    /* TOTAL */
    /* -------------------------------------------- */

    const totalAmount = items.reduce(
      (acc, item) => acc + item.total,
      0
    );

    const paidAmount = Number(data.paidAmount || 0);

    /* -------------------------------------------- */
    /* VALIDATION */
    /* -------------------------------------------- */

    if (paidAmount > totalAmount) {
      throw new Error(
        "Paid amount cannot exceed total amount"
      );
    }

    /* -------------------------------------------- */
    /* STATUS */
    /* -------------------------------------------- */

    let status = "PENDING";

    if (paidAmount >= totalAmount) {

      status = "PAID";

    } else if (paidAmount > 0) {

      status = "PARTIAL";
    }

    /* -------------------------------------------- */
    /* CREATE SALE */
    /* -------------------------------------------- */

    const sale = await Sale.create(
      [
        {
          ...data,

          salesNumber,

          items,

          totalAmount,

          paidAmount,

          status,
        },
      ],

      { session }
    );

    const saleDoc = sale[0];

    /* -------------------------------------------- */
    /* STOCK OUT */
    /* -------------------------------------------- */

    for (const item of items) {

      // FETCH ITEM
      const dbItem = await Item.findById(
        item.itemId
      );

      if (!dbItem) {
        throw new Error("Item not found");
      }

      /* -------------------------------------------- */
      /* STRICT STOCK CHECK */
      /* -------------------------------------------- */

      // maintainStock = true
      // NEGATIVE STOCK NOT ALLOWED

      if (dbItem.maintainStock) {

        const currentStock =
          await stockService.getCurrentStock(
            item.itemId,
            data.companyId,
            data.branchId
          );

        if (currentStock < item.quantity) {

          throw new Error(
            `${dbItem.name} has insufficient stock`
          );
        }
      }

      /* -------------------------------------------- */
      /* ALWAYS DECREASE STOCK */
      /* -------------------------------------------- */

      await stockService.decreaseStock({
        itemId: item.itemId,

        companyId: data.companyId,

        branchId: data.branchId,

        quantity: item.quantity,

        maintainStock: dbItem.maintainStock,

        session,
      });

      /* -------------------------------------------- */
      /* ALWAYS CREATE STOCK TRANSACTION */
      /* -------------------------------------------- */

      await stockTransactionService.createStockTransaction(
        {
          itemId: item.itemId,

          companyId: data.companyId,

          branchId: data.branchId,

          type: "OUT",

          quantity: item.quantity,

          referenceType: "SALE",

          referenceId: saleDoc._id,
        },

        session
      );
    }

    /* -------------------------------------------- */
    /* SALES INVOICE ENTRY */
    /* -------------------------------------------- */

    await ledgerService.createLedgerEntry(
      {
        partyId: data.partyId,

        companyId: data.companyId,

        branchId: data.branchId,

        type: "DEBIT",

        amount: totalAmount,

        referenceType: "SALE",

        referenceId: saleDoc._id,

        description:
          `Invoice ${salesNumber} generated for customer sale`,
      },

      session
    );

    /* -------------------------------------------- */
    /* PAYMENT RECEIVED */
    /* -------------------------------------------- */

    if (paidAmount > 0) {

      await ledgerService.createLedgerEntry(
        {
          partyId: data.partyId,

          companyId: data.companyId,

          branchId: data.branchId,

          type: "CREDIT",

          amount: paidAmount,

          referenceType: "RECEIPT",

          referenceId: saleDoc._id,

          description:
            `Payment received against Invoice ${salesNumber} via ${data.paymentMode?.toUpperCase()}`,
        },

        session
      );
    }

    /* -------------------------------------------- */
    /* COMMIT */
    /* -------------------------------------------- */

    await session.commitTransaction();

    session.endSession();

    return saleDoc;

  } catch (error) {

    await session.abortTransaction();

    session.endSession();

    throw error;
  }
};

/* ------------------------------------------------ */
/* GET SALES */
/* ------------------------------------------------ */

const getAllSales = async (
  companyId,
  branchId
) => {

  try {

    return await Sale.find({
      companyId,
      branchId,
    })

      .populate(
        "partyId",
        "name phone"
      )

      .populate(
        "items.itemId",
        "name sku unit maintainStock"
      )

      .sort({
        createdAt: -1,
      });

  } catch (error) {

    throw new Error(
      "Error fetching sales from database"
    );
  }
};

const getSaleById = async (
  saleId,
  companyId,
  branchId
) => {

  try {

    return await Sale.findOne({
      _id: saleId,

      companyId,

      branchId,
    })

      .populate(
        "partyId",
        "name phone"
      )

      .populate(
        "items.itemId",
        "name sku unit maintainStock"
      );

  } catch (error) {

    throw new Error(
      "Error fetching sale from database"
    );
  }
};

module.exports = {
  createSale,
  getSaleById,
  getAllSales,
};





















































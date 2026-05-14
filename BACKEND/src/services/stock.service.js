const Stock = require("../models/stock.model");

// Saari inventory ka status nikalne ke liye
const getAllStock = async (companyId, branchId) => {
  return await Stock.find({ companyId, branchId })
    .populate("itemId", "name sku unit costPrice sellingPrice barcode category brand maintainStock") // Item details bhi le aao
    .sort({ quantity: 1 }); // Kam stock waale pehle dikhenge
};



// Kisi specific item ka stock badhane ke liye (Purchase/Sales Return)
const increaseStock = async ({ itemId, companyId, branchId, quantity, session }) => {
  return await Stock.findOneAndUpdate(
    { itemId, companyId, branchId },
    { $inc: { quantity: quantity } },
    { upsert: true, new: true, session }
  );
};

// // Stock kam karne ke liye (Sales/Purchase Return)
// const decreaseStock = async ({ itemId, companyId, branchId, quantity, session }) => {
//   const stock = await Stock.findOne({ itemId, companyId, branchId }).session(session);
  
//   if (!stock || stock.quantity < quantity) {
//     throw new Error("Insufficient stock in warehouse");
//   }

//   stock.quantity -= quantity;
//   return await stock.save({ session });
// };

const decreaseStock = async ({
  itemId,
  companyId,
  branchId,
  quantity,
  maintainStock,
  session,
}) => {

  let stock = await Stock.findOne({
    itemId,
    companyId,
    branchId,
  }).session(session);

  // CREATE STOCK RECORD
  if (!stock) {

    stock = await Stock.create(
      [
        {
          itemId,
          companyId,
          branchId,
          quantity: 0,
        },
      ],
      { session }
    );

    stock = stock[0];
  }

  // STRICT VALIDATION
  if (
    maintainStock &&
    stock.quantity < quantity
  ) {
    throw new Error(
      "Insufficient stock in warehouse"
    );
  }

  // DECREASE
  stock.quantity -= quantity;

  return await stock.save({ session });
};


module.exports = { getAllStock, increaseStock, decreaseStock };

// const Item = require("../models/item.model");

// const createItem = async (data) => {
//   const existing = await Item.findOne({
//     sku: data.sku,
//     companyId: data.companyId,
//   });

//   if (existing) {
//     throw new Error("Item with this SKU already exists");
//   }

//   const item = await Item.create(data);
//   return item;
// };

// const getItems = async (companyId) => {
//   return await Item.find({ companyId });
// };

// const getItemById = async (itemId, companyId) => {
//   try {
//     const item = await Item.findOne({
//       _id: itemId,
//       companyId: companyId,
//     });
//     return item;
//   } catch (error) {
//     throw new Error("Service Error: " + error.message);
//   }
// };

// module.exports = {
//   createItem,
//   getItems,
//   getItemById,
// };



const Item = require("../models/item.model");

const createItem = async (data) => {
  try {
    const sku = data.sku.toUpperCase().trim();

    const existing = await Item.findOne({
      sku,
      companyId: data.companyId,
    });

    if (existing) {
      throw new Error("Item with this SKU already exists");
    }

    const item = await Item.create({
      ...data,
      sku,
      maintainStock:
        data.maintainStock !== undefined
          ? data.maintainStock
          : true,
    });

    return item;
  } catch (error) {
    throw new Error("Service Error: " + error.message);
  }
};

const getItems = async (companyId) => {
  try {
    return await Item.find({
      companyId,
      isActive: true,
    }).sort({
      createdAt: -1,
    });
  } catch (error) {
    throw new Error("Service Error: " + error.message);
  }
};

const getItemById = async (itemId, companyId) => {
  try {
    const item = await Item.findOne({
      _id: itemId,
      companyId,
      isActive: true,
    });

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  } catch (error) {
    throw new Error("Service Error: " + error.message);
  }
};

const updateItem = async (
  itemId,
  companyId,
  updateData
) => {
  try {
    // normalize SKU if updating
    if (updateData.sku) {
      updateData.sku =
        updateData.sku.toUpperCase().trim();

      const existing = await Item.findOne({
        sku: updateData.sku,
        companyId,
        _id: { $ne: itemId },
      });

      if (existing) {
        throw new Error(
          "Another item with this SKU already exists"
        );
      }
    }

    const item = await Item.findOneAndUpdate(
      {
        _id: itemId,
        companyId,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  } catch (error) {
    throw new Error("Service Error: " + error.message);
  }
};

const deleteItem = async (itemId, companyId) => {
  try {
    const item = await Item.findOneAndUpdate(
      {
        _id: itemId,
        companyId,
      },
      {
        isActive: false,
      },
      {
        new: true,
      }
    );

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  } catch (error) {
    throw new Error("Service Error: " + error.message);
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
};
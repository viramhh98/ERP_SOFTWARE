const Item = require("../models/item.model");

const createItem = async (data) => {
  const existing = await Item.findOne({
    sku: data.sku,
    companyId: data.companyId,
  });

  if (existing) {
    throw new Error("Item with this SKU already exists");
  }

  const item = await Item.create(data);
  return item;
};

const getItems = async (companyId) => {
  return await Item.find({ companyId });
};

const getItemById = async (itemId, companyId) => {
  try {
    const item = await Item.findOne({
      _id: itemId,
      companyId: companyId,
    });
    return item;
  } catch (error) {
    throw new Error("Service Error: " + error.message);
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
};

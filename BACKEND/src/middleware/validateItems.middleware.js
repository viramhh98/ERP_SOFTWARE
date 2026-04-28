const validateCreateItem = (req, res, next) => {
  const { name, sku, unit } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Item name is required"
    });
  }

  if (!sku) {
    return res.status(400).json({
      message: "SKU is required"
    });
  }

  if (!unit) {
    return res.status(400).json({
      message: "Unit is required"
    });
  }

  next();
};

module.exports = {
  validateCreateItem
};
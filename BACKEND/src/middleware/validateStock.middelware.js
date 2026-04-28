const validateGetStock = (req, res, next) => {
  const { itemId } = req.query;

  if (!itemId) {
    return res.status(400).json({
      message: "itemId is required"
    });
  }

  next();
};

module.exports = {
  validateGetStock
};
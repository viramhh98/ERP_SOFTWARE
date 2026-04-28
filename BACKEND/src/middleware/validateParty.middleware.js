const validateCreateParty = (req, res, next) => {
  const { name, type, phone, email, address, companyId } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Party name is required",
    });
  }

  if (!type) {
    return res.status(400).json({
      message: "Party type is required",
    });
  }

  if(!phone) {
    return res.status(400).json({
      message: "Party phone number is required",
    });
  }

  next();
};

module.exports = {
  validateCreateParty,
};

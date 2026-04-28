const Party = require("../models/party.model");
const Item = require("../models/item.model");

const validateCreateSale = async (req, res, next) => {
  try {
    const { partyId, items } = req.body;
    const companyId = req.user.activeCompanyId;

    if (!partyId) {
      return res.status(400).json({ message: "partyId is required" });
    }

    const party = await Party.findOne({ _id: partyId, companyId });

    if (!party) {
      return res.status(404).json({ message: "Invalid partyId" });
    }

    if (!items || !items.length) {
      return res.status(400).json({ message: "Items are required" });
    }

    const itemIds = items.map(i => i.itemId);

    const validItems = await Item.find({
      _id: { $in: itemIds },
      companyId
    });

    const validIds = validItems.map(i => i._id.toString());

    const invalidItems = itemIds.filter(
      id => !validIds.includes(id.toString())
    );

    if (invalidItems.length > 0) {
      return res.status(400).json({
        message: "Some items do not exist",
        invalidItems
      });
    }

    next();

  } catch (error) {
    res.status(500).json({ message: "Validation error" });
  }
};

module.exports = {
  validateCreateSale
};
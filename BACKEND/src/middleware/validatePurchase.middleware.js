const Party = require("../models/party.model");
const Item = require("../models/item.model");

const validateCreatePurchase = async (req, res, next) => {
  try {
    const { partyId, items, totalAmount } = req.body;
    const companyId = req.user.activeCompanyId;

    // 1️⃣ partyId required
    if (!partyId) {
      return res.status(400).json({ message: "partyId is required" });
    }

    // 2️⃣ Check party exists
    const party = await Party.findOne({
      _id: partyId,
      companyId
    });

    if (!party) {
      return res.status(404).json({
        message: "Invalid partyId"
      });
    }

    // 3️⃣ Items validation
    if (!items || !items.length) {
      return res.status(400).json({
        message: "Items are required"
      });
    }

    // 🔥 Collect all itemIds
    const itemIds = items.map(i => i.itemId);

    // 4️⃣ Fetch all valid items
    const validItems = await Item.find({
      _id: { $in: itemIds },
      companyId
    });

    const validItemIds = validItems.map(i => i._id.toString());

    // 5️⃣ Find missing items
    const invalidItems = itemIds.filter(
      id => !validItemIds.includes(id.toString())
    );

    if (invalidItems.length > 0) {
      return res.status(400).json({
        message: "Some items do not exist",
        invalidItems // 🔥 exact IDs returned
      });
    }

    // 6️⃣ Structure validation
    for (const item of items) {
      if (!item.itemId || !item.quantity || !item.price) {
        return res.status(400).json({
          message: "Invalid item structure"
        });
      }
    }

    // 7️⃣ totalAmount
    if (!totalAmount) {
      return res.status(400).json({
        message: "totalAmount is required"
      });
    }

    next();

  } catch (error) {
    return res.status(500).json({
      message: "Validation error"
    });
  }
};

module.exports = {
  validateCreatePurchase
};
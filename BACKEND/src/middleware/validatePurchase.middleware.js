// const Party = require("../models/party.model");
// const Item = require("../models/item.model");

// const validateCreatePurchase = async (req, res, next) => {
//   try {
//     const { partyId, items, totalAmount } = req.body;
//     const companyId = req.user.activeCompanyId;

//     // 1️⃣ partyId required
//     if (!partyId) {
//       return res.status(400).json({ message: "partyId is required" });
//     }

//     // 2️⃣ Check party exists
//     const party = await Party.findOne({
//       _id: partyId,
//       companyId
//     });

//     if (!party) {
//       return res.status(404).json({
//         message: "Invalid partyId"
//       });
//     }

//     // 3️⃣ Items validation
//     if (!items || !items.length) {
//       return res.status(400).json({
//         message: "Items are required"
//       });
//     }

//     // 🔥 Collect all itemIds
//     const itemIds = items.map(i => i.itemId);

//     // 4️⃣ Fetch all valid items
//     const validItems = await Item.find({
//       _id: { $in: itemIds },
//       companyId
//     });

//     const validItemIds = validItems.map(i => i._id.toString());

//     // 5️⃣ Find missing items
//     const invalidItems = itemIds.filter(
//       id => !validItemIds.includes(id.toString())
//     );

//     if (invalidItems.length > 0) {
//       return res.status(400).json({
//         message: "Some items do not exist",
//         invalidItems // 🔥 exact IDs returned
//       });
//     }

//     // 6️⃣ Structure validation
//     for (const item of items) {
//       if (!item.itemId || !item.quantity || !item.price) {
//         return res.status(400).json({
//           message: "Invalid item structure"
//         });
//       }
//     }

//     // 7️⃣ totalAmount
//     if (!totalAmount) {
//       return res.status(400).json({
//         message: "totalAmount is required"
//       });
//     }

//     next();

//   } catch (error) {
//     return res.status(500).json({
//       message: "Validation error"
//     });
//   }
// };

// module.exports = {
//   validateCreatePurchase
// };




const Party = require("../models/party.model");
const Item = require("../models/item.model");

const validateCreatePurchase = async (req, res, next) => {
  try {
    const { partyId, items, totalAmount } = req.body;
    const companyId = req.user.activeCompanyId;

    // 1️⃣ partyId required
    if (!partyId) {
      return res.status(400).json({
        message: "partyId is required",
      });
    }

    // 2️⃣ Check party exists
    const party = await Party.findOne({
      _id: partyId,
      companyId,
    });

    if (!party) {
      return res.status(404).json({
        message: "Invalid partyId",
      });
    }

    // 3️⃣ Items validation
    if (!items || !items.length) {
      return res.status(400).json({
        message: "Items are required",
      });
    }

    // 4️⃣ Validate structure first
    for (const item of items) {
      if (!item.itemId || !item.quantity || !item.price) {
        return res.status(400).json({
          message: "Invalid item structure",
        });
      }
    }

    // 5️⃣ Collect itemIds
    const itemIds = items.map((i) => i.itemId);

    // 6️⃣ Fetch valid active items
    const validItems = await Item.find({
      _id: { $in: itemIds },
      companyId,
      isActive: true,
    });

    const validItemIds = validItems.map((i) =>
      i._id.toString()
    );

    // 7️⃣ Find invalid items
    const invalidItems = itemIds.filter(
      (id) => !validItemIds.includes(id.toString())
    );

    if (invalidItems.length > 0) {
      return res.status(400).json({
        message: "Some items are invalid or inactive",
        invalidItems,
      });
    }

    // 8️⃣ totalAmount validation
    if (totalAmount == null || totalAmount < 0) {
      return res.status(400).json({
        message: "Valid totalAmount is required",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Validation error",
      error: error.message,
    });
  }
};

module.exports = {
  validateCreatePurchase,
};
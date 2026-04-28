const partyService = require("../services/party.service");

// const createParty = async (req, res) => {
//   try {
//     const party = await partyService.createParty(req.body);

//     res.status(201).json({
//       message: "Party created successfully",
//       data: party
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error creating party"
//     });
//   }
// };

const createParty = async (req, res) => {
  try {
    const companyId = req.user.activeCompanyId;

    const party = await partyService.createParty({
      ...req.body,
      companyId,
    });

    res.status(201).json({
      success: true,
      message: "Party created successfully",
      data: party,
    });
  } catch (error) {
    // Detailed error handling for unique phone
    const status = error.message.includes("already registered") ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

const getParties = async (req, res) => {
  try {
    const companyId = req.user.activeCompanyId;
    const { type, search } = req.query;

    if (!companyId) {
      return res
        .status(400)
        .json({ message: "Active Company selection required" });
    }

    const parties = await partyService.getParties({
      companyId,
      type,
      search,
    });

  
    res.json(parties);
  } catch (error) {
    res.status(500).json({ message: "Cloud sync error in registry" });
  }
};

const getPartyByPhone = async (req, res) => {
  try {
    const companyId = req.user.activeCompanyId;
    const { phone } = req.query;

    if (!phone || !companyId) {
      return res.status(400).json({
        message: "phone and companyId are required",
      });
    }

    const party = await partyService.getPartyByPhone({
      phone,
      companyId,
    });

    if (!party) {
      return res.status(404).json({
        message: "Party not found",
      });
    }

    res.status(200).json({
      message: "Party fetched successfully",
      data: party,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching party",
    });
  }
};

module.exports = {
  createParty,
  getParties,
  getPartyByPhone,
};

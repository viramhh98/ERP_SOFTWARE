// const Party = require("../models/party.model");

// const createParty = async (data) => {
//   const party = await Party.create(data);
//   return party;
// };

// const getParties = async ({ companyId, type }) => {
//   const query = { companyId };

//   if (type) {
//     query.type = type;
//   }

//   const parties = await Party.find(query);

//   return parties;
// };

// const getPartyByPhone = async ({ phone, companyId }) => {
//   return await Party.findOne({
//     phone,
//     companyId,
//   });
// };

// module.exports = {
//   createParty,
//   getParties,
//   getPartyByPhone,
// };



const Party = require("../models/party.model");

const createParty = async (data) => {
  // Check if phone already exists in this company
  const existing = await Party.findOne({ phone: data.phone, companyId: data.companyId });
  if (existing) {
    throw new Error("This phone number is already registered.");
  }
  return await Party.create(data);
};

const getParties = async ({ companyId, type, search }) => {
  const query = { companyId };


  // Strict check for type
  if (type && type !== 'all') {
    query.type = type;
  }

  // Adding regex search logic (optional but recommended)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }
  return await Party.find(query).sort({ createdAt: -1 });
};

const getPartyByPhone = async ({ phone, companyId }) => {
  return await Party.findOne({ phone, companyId });
};

module.exports = { createParty, getParties, getPartyByPhone };

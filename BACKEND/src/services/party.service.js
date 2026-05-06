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



// const Party = require("../models/party.model");

// const createParty = async (data) => {
//   // Check if phone already exists in this company
//   const existing = await Party.findOne({ phone: data.phone, companyId: data.companyId });
//   if (existing) {
//     throw new Error("This phone number is already registered.");
//   }
//   return await Party.create(data);
// };

// const getParties = async ({ companyId, type, search }) => {
//   const query = { companyId };


//   // Strict check for type
//   if (type && type !== 'all') {
//     query.type = type;
//   }

//   // Adding regex search logic (optional but recommended)
//   if (search) {
//     query.$or = [
//       { name: { $regex: search, $options: 'i' } },
//       { phone: { $regex: search, $options: 'i' } }
//     ];
//   }
//   return await Party.find(query).sort({ createdAt: -1 });
// };

// const getPartyByPhone = async ({ phone, companyId }) => {
//   return await Party.findOne({ phone, companyId });
// };

// module.exports = { createParty, getParties, getPartyByPhone };




const Party = require("../models/party.model");
const ledgerService = require("./ledger.service");
const mongoose = require("mongoose");

const createParty = async (data) => {
  // Use a Transaction to ensure both Party and Ledger are created together
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Check if phone already exists in this company
    const existing = await Party.findOne({ 
      phone: data.phone, 
      companyId: data.companyId 
    }).session(session);

    if (existing) {
      throw new Error("This phone number is already registered.");
    }

    // 2. Create the Party
    // We set the initial balance to 0 because createLedgerEntry will increment it
    const partyData = { ...data, balance: 0 };
    const newParty = await Party.create([partyData], { session });
    const party = newParty[0];

    // 3. Create Opening Balance Ledger Entry if balance > 0
    if (data.balance && parseFloat(data.balance) !== 0) {
      await ledgerService.createLedgerEntry({
        partyId: party._id,
        companyId: party.companyId,
        branchId: party.branchId,
        // Supplier opening balance = CREDIT
        // Customer opening balance = DEBIT
        type: party.type === 'supplier' ? 'CREDIT' : 'DEBIT',
        amount: Math.abs(parseFloat(data.balance)),
        referenceType: 'OPENING_BALANCE',
        referenceId: party._id, // Self-reference for opening balance
        description: `Opening balance for ${party.name}`
      }, session);
    }

    await session.commitTransaction();
    session.endSession();
    
    // Return the updated party (which now has the correct balance via createLedgerEntry)
    return await Party.findById(party._id);

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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



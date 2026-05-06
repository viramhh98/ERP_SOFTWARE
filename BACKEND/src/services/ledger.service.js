// const Ledger = require("../models/ledger.model");
// const mongoose=require('mongoose');

// const createLedger = async ({
//   partyId,
//   companyId,
//   branchId,
//   type,
//   amount,
//   referenceType,
//   referenceId,
//   description
// }, session) => {

//   const entry = await Ledger.create([{
//     partyId,
//     companyId,
//     branchId,
//     type,
//     amount,
//     referenceType,
//     referenceId,
//     description
//   }], { session });

//   return entry[0];
// };




// const getLedgerByParty = async (partyId, companyId) => {
//   return await Ledger.find({ 
//     partyId, 
//     companyId 
//   }).sort({ createdAt: -1 }); // Nayi entries sabse pehle
// };

// const getPartyBalance = async (partyId, companyId) => {
//   const stats = await Ledger.aggregate([
//     { 
//       $match: { 
//         partyId: new mongoose.Types.ObjectId(partyId), 
//         companyId: new mongoose.Types.ObjectId(companyId) 
//       } 
//     },
//     {
//       $group: {
//         _id: null,
//         totalCredit: { $sum: { $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0] } },
//         totalDebit: { $sum: { $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0] } }
//       }
//     }
//   ]);

//   if (stats.length === 0) return 0;
//   // CREDIT (Bill) - DEBIT (Payment) = Net Payable
//   return stats[0].totalDebit - stats[0].totalCredit ;
// };




// // Nayi entry create karne ke liye
// const createLedgerEntry = async (ledgerData, session = null) => {
//   const options = session ? { session } : {};
//   const entry = await Ledger.create([ledgerData], options);
//   return entry[0];
// };



// module.exports = {createLedger, getLedgerByParty, getPartyBalance ,createLedgerEntry};





const Ledger = require("../models/ledger.model");
const Party = require("../models/party.model");
const mongoose = require('mongoose');

/**
 * Helper to calculate how much to add/subtract from Party balance
 */
const calculateBalanceChange = (partyType, entryType, amount) => {
    if (partyType === 'supplier') {
        // For Suppliers: CREDIT increases debt, DEBIT decreases debt
        return entryType === 'CREDIT' ? amount : -amount;
    } else {
        // For Customers: DEBIT increases debt (invoice), CREDIT decreases debt (payment)
        return entryType === 'DEBIT' ? amount : -amount;
    }
};

const createLedger = async ({
  partyId,
  companyId,
  branchId,
  type,
  amount,
  referenceType,
  referenceId,
  description
}, session) => {

  const entry = await Ledger.create([{
    partyId,
    companyId,
    branchId,
    type,
    amount,
    referenceType,
    referenceId,
    description
  }], { session });

  return entry[0];
};

const createLedgerEntry = async (ledgerData, session = null) => {
    const options = session ? { session } : {};
    
    // 1. Create the Ledger Entry
    const entry = await Ledger.create([ledgerData], options);

    // 2. Find the party to know their type (Customer vs Supplier)
    const party = await Party.findById(ledgerData.partyId).session(session);
    if (!party) throw new Error("Party not found during balance update");

    // 3. Calculate Balance Change
    const change = calculateBalanceChange(party.type, ledgerData.type, ledgerData.amount);

    // 4. Atomically update the Party Balance
    await Party.findByIdAndUpdate(
        ledgerData.partyId,
        { $inc: { balance: change } },
        { session, new: true }
    );

    return entry[0];
};

const getLedgerByParty = async (partyId, companyId) => {
    return await Ledger.find({ 
        partyId, 
        companyId 
    }).sort({ createdAt: -1 });
};

const getPartyBalance = async (partyId, companyId) => {
    const party = await Party.findOne({ _id: partyId, companyId });
    return party ? party.balance : 0;
};

module.exports = { 
    getLedgerByParty, 
    getPartyBalance, 
    createLedgerEntry ,
    createLedger
};
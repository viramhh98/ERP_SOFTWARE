const Ledger = require("../models/ledger.model");
const mongoose=require('mongoose');

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




const getLedgerByParty = async (partyId, companyId) => {
  return await Ledger.find({ 
    partyId, 
    companyId 
  }).sort({ createdAt: -1 }); // Nayi entries sabse pehle
};

const getPartyBalance = async (partyId, companyId) => {
  const stats = await Ledger.aggregate([
    { 
      $match: { 
        partyId: new mongoose.Types.ObjectId(partyId), 
        companyId: new mongoose.Types.ObjectId(companyId) 
      } 
    },
    {
      $group: {
        _id: null,
        totalCredit: { $sum: { $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0] } },
        totalDebit: { $sum: { $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0] } }
      }
    }
  ]);

  if (stats.length === 0) return 0;
  // CREDIT (Bill) - DEBIT (Payment) = Net Payable
  return stats[0].totalCredit - stats[0].totalDebit;
};




// Nayi entry create karne ke liye
const createLedgerEntry = async (ledgerData, session = null) => {
  const options = session ? { session } : {};
  const entry = await Ledger.create([ledgerData], options);
  return entry[0];
};



module.exports = {createLedger, getLedgerByParty, getPartyBalance ,createLedgerEntry};




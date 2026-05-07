// const Ledger = require("../models/ledger.model");
// const Party = require("../models/party.model");
// const mongoose = require('mongoose');

// /**
//  * Helper to calculate how much to add/subtract from Party balance
//  */
// const calculateBalanceChange = (partyType, entryType, amount) => {
//     if (partyType === 'supplier') {
//         // For Suppliers: CREDIT increases debt, DEBIT decreases debt
//         return entryType === 'CREDIT' ? amount : -amount;
//     } else {
//         // For Customers: DEBIT increases debt (invoice), CREDIT decreases debt (payment)
//         return entryType === 'DEBIT' ? amount : -amount;
//     }
// };

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

// const createLedgerEntry = async (ledgerData, session = null) => {
//     const options = session ? { session } : {};

//     // 1. Create the Ledger Entry
//     const entry = await Ledger.create([ledgerData], options);

//     // 2. Find the party to know their type (Customer vs Supplier)
//     const party = await Party.findById(ledgerData.partyId).session(session);
//     if (!party) throw new Error("Party not found during balance update");

//     // 3. Calculate Balance Change
//     const change = calculateBalanceChange(party.type, ledgerData.type, ledgerData.amount);

//     // 4. Atomically update the Party Balance
//     await Party.findByIdAndUpdate(
//         ledgerData.partyId,
//         { $inc: { balance: change } },
//         { session, new: true }
//     );

//     return entry[0];
// };

// const getLedgerByParty = async (partyId, companyId) => {
//     return await Ledger.find({
//         partyId,
//         companyId
//     }).sort({ createdAt: -1 });
// };

// const getPartyBalance = async (partyId, companyId) => {
//     const party = await Party.findOne({ _id: partyId, companyId });
//     return party ? party.balance : 0;
// };

// module.exports = {
//     getLedgerByParty,
//     getPartyBalance,
//     createLedgerEntry ,
//     createLedger
// };

const Ledger = require("../models/ledger.model");

const Party = require("../models/party.model");

const mongoose = require("mongoose");

/* -------------------------------------------- */
/* BALANCE CALCULATOR */
/* -------------------------------------------- */

const calculateBalanceChange = (partyType, entryType, amount) => {
  const amt = Number(amount);

  /* -------------------------------------------- */
  /* SUPPLIER */
  /* -------------------------------------------- */

  if (partyType === "supplier") {
    /*
      CREDIT  -> Purchase Bill
      DEBIT   -> Payment To Supplier
    */

    return entryType === "CREDIT" ? amt : -amt;
  }

  /* -------------------------------------------- */
  /* CUSTOMER */
  /* -------------------------------------------- */

  /*
    DEBIT  -> Sales Bill
    CREDIT -> Customer Payment
  */

  return entryType === "DEBIT" ? amt : -amt;
};

/* -------------------------------------------- */
/* CREATE LEDGER ENTRY */
/* -------------------------------------------- */

const createLedgerEntry = async (
  {
    partyId,

    companyId,

    branchId,

    type,

    amount,

    referenceType,

    referenceId,

    description,
  },

  session = null
) => {
  const options = session ? { session } : {};

  /* -------------------------------------------- */
  /* VALIDATION */
  /* -------------------------------------------- */

  if (!partyId) {
    throw new Error("partyId is required");
  }

  if (!amount || Number(amount) <= 0) {
    throw new Error("Invalid ledger amount");
  }

  /* -------------------------------------------- */
  /* FIND PARTY */
  /* -------------------------------------------- */

  const party = await Party.findById(partyId).session(session);

  if (!party) {
    throw new Error("Party not found");
  }

  /* -------------------------------------------- */
  /* CREATE LEDGER */
  /* -------------------------------------------- */

  const entry = await Ledger.create(
    [
      {
        partyId,

        companyId,

        branchId,

        type,

        amount: Number(amount),

        referenceType,

        referenceId,

        description,
      },
    ],

    options
  );

  /* -------------------------------------------- */
  /* BALANCE CHANGE */
  /* -------------------------------------------- */

  const balanceChange = calculateBalanceChange(
    party.type,

    type,

    amount
  );

  /* -------------------------------------------- */
  /* UPDATE PARTY BALANCE */
  /* -------------------------------------------- */

  await Party.findByIdAndUpdate(
    partyId,

    {
      $inc: {
        balance: balanceChange,
      },
    },

    {
      session,
      new: true,
    }
  );

  return entry[0];
};

/* -------------------------------------------- */
/* GET LEDGER BY PARTY */
/* -------------------------------------------- */

const getLedgerByParty = async (partyId, companyId) => {
  return await Ledger.find({
    partyId,

    companyId,
  })

    .sort({
      createdAt: -1,
    })

    .populate("partyId", "name phone type balance");
};

/* -------------------------------------------- */
/* GET PARTY BALANCE */
/* -------------------------------------------- */

const getPartyBalance = async (partyId, companyId) => {
  const party = await Party.findOne({
    _id: partyId,

    companyId,
  });

  return party ? party.balance : 0;
};

/* -------------------------------------------- */
/* OPTIONAL */
/* MANUAL BALANCE RECALC */
/* -------------------------------------------- */

const recalculatePartyBalance = async (partyId, companyId) => {
  const entries = await Ledger.find({
    partyId,

    companyId,
  });

  const party = await Party.findById(partyId);

  if (!party) {
    throw new Error("Party not found");
  }

  let balance = 0;

  for (const entry of entries) {
    balance += calculateBalanceChange(
      party.type,

      entry.type,

      entry.amount
    );
  }

  await Party.findByIdAndUpdate(
    partyId,

    {
      balance,
    }
  );

  return balance;
};

module.exports = {
  createLedgerEntry,

  getLedgerByParty,

  getPartyBalance,

  recalculatePartyBalance,
};

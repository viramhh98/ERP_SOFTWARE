const ledgerService = require("../services/ledger.service");
const mongoose = require("mongoose");
const Party = require("../models/party.model"); // Model import zaroori hai


const getPartyLedger = async (req, res) => {
  try {
    const { partyId } = req.params;
    const companyId = req.user.activeCompanyId;

    // Service se Ledger entries aur Balance dono mangwayenge
    const entries = await ledgerService.getLedgerByParty(partyId, companyId);
    const balance = await ledgerService.getPartyBalance(partyId, companyId);

    res.status(200).json({
      success: true,
      data: entries,
      balance: balance, // Current Outstanding
      message: "Ledger statements retrieved"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// const postPayment = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { partyId, amount, paymentMode, description, referenceId } = req.body;
//     const companyId = req.user.activeCompanyId;
//     const branchId = req.user.activeBranchId;

//     if (!amount || amount <= 0) throw new Error("Invalid payment amount");

//     // 1. Create DEBIT entry (Paisa gaya)
//     const paymentData = {
//       partyId,
//       companyId,
//       branchId,
//       type: "DEBIT", 
//       amount: parseFloat(amount),
//       referenceType: "PAYMENT",
//       referenceId: referenceId || new mongoose.Types.ObjectId(), // Agar bill ID nahi hai toh random ID
//       description: description || `Payment via ${paymentMode}`
//     };

//     const entry = await ledgerService.createLedgerEntry(paymentData, session);

//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({
//       success: true,
//       message: "Payment recorded successfully",
//       data: entry
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ success: false, message: error.message });
//   }
// };



const postPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { partyId, amount, paymentMode, description, referenceId } = req.body;
    const companyId = req.user.activeCompanyId;
    const branchId = req.user.activeBranchId;

    if (!amount || amount <= 0) throw new Error("Invalid payment amount");

    // 1️⃣ Pehle Party ka Type check karo (Customer hai ya Supplier)
    const party = await Party.findById(partyId).session(session);
    if (!party) throw new Error("Party not found");

    // 2️⃣ Accounting Logic:
    // Supplier ko payment di -> DEBIT (Udhaar kam hua)
    // Customer se payment mili -> CREDIT (Leni kam hui)
    const entryType = (party.type === 'supplier') ? "DEBIT" : "CREDIT";

    // 3️⃣ Ledger Entry Data Prepare Karo
    const paymentData = {
      partyId,
      companyId,
      branchId,
      type: entryType, 
      amount: parseFloat(amount),
      referenceType: "PAYMENT",
      referenceId: referenceId || new mongoose.Types.ObjectId(),
      description: description || `${party.type === 'supplier' ? 'Payment Out' : 'Receipt In'} via ${paymentMode}`
    };

    const entry = await ledgerService.createLedgerEntry(paymentData, session);

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: party.type === 'supplier' ? "Payment Out recorded" : "Receipt In recorded",
      data: entry
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  postPayment,
  getPartyLedger
};



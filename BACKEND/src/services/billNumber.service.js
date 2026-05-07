// services/billNumber.service.js

const mongoose = require("mongoose");

const BillNumberConfig = require(
  "../models/billNumberConfigSchema.model"
);

const Branch = require(
  "../models/branch.model"
);

const Company = require(
  "../models/company.model"
);

/* ------------------------------------------------ */
/* FINANCIAL YEAR */
/* ------------------------------------------------ */

const getFinancialYear = () => {

  const today = new Date();

  const year = today.getFullYear();

  const month =
    today.getMonth() + 1;

  if (month >= 4) {

    return `${year}-${String(
      year + 1
    ).slice(-2)}`;

  } else {

    return `${year - 1}-${String(
      year
    ).slice(-2)}`;
  }
};

/* ------------------------------------------------ */
/* PREFIX MAP */
/* ------------------------------------------------ */

const voucherPrefixes = {

  "Sales Invoice": "INV",

  "Purchase Invoice": "PUR",

  "Debit Note": "DN",

  "Credit Note": "CN",

  Quotation: "QUO",
};

/* ------------------------------------------------ */
/* GENERATE BILL NUMBER */
/* ------------------------------------------------ */

const generateBillNumber = async ({

  activeCompanyId,

  activeBranchId,

  voucherType,
}) => {

  /* -------------------------------------------- */
  /* OBJECT IDS */
  /* -------------------------------------------- */

  const companyObjectId =
    new mongoose.Types.ObjectId(
      activeCompanyId
    );

  const branchObjectId =
    new mongoose.Types.ObjectId(
      activeBranchId
    );

  /* -------------------------------------------- */
  /* FIND EXISTING CONFIG */
  /* -------------------------------------------- */

  let config =
    await BillNumberConfig.findOne({

      companyId:
        companyObjectId,

      branchId:
        branchObjectId,

      voucherType,

      isActive: true,
    });

  /* -------------------------------------------- */
  /* CREATE CONFIG IF NOT EXISTS */
  /* -------------------------------------------- */

  if (!config) {

    

    /* ---------- COMPANY ---------- */

    const company =
      await Company.findById(
        companyObjectId
      );

    /* ---------- BRANCH ---------- */

    const branch =
      await Branch.findById(
        branchObjectId
      );

    /* ---------- CREATE ---------- */

    config =
      await BillNumberConfig.create({

        companyId:
          companyObjectId,

        branchId:
          branchObjectId,

        voucherType,

        /* COMPANY CODE */

        companyCode:
          company?.code ||
          company?.shortName ||
          "ERP",

        /* BRANCH CODE */

        branchCode:

          branch?.name

            ?.replace(/\s+/g, "")

            ?.substring(0, 3)

            ?.toUpperCase()

          || "MAIN",

        /* CONFIG */

        prefix:
          voucherPrefixes[
            voucherType
          ] || "INV",

        suffix: "",

        separator: "/",

        financialYear:
          getFinancialYear(),

        includeFY: true,

        includeBranch: true,

        includeMonth: false,

        resetEveryFY: true,

        autoGenerate: true,

        numberPadding: 4,

        /* IMPORTANT */

        currentSequence: 0,

        lastGeneratedBillNo: "",

        isActive: true,
      });
  }

  /* -------------------------------------------- */
  /* FY RESET */
  /* -------------------------------------------- */

  const currentFY =
    getFinancialYear();

  if (

    config.resetEveryFY &&

    config.financialYear !==
      currentFY

  ) {

   

    config.financialYear =
      currentFY;

    config.currentSequence = 0;

    await config.save();
  }

  /* -------------------------------------------- */
  /* INCREMENT */
  /* -------------------------------------------- */

  const updatedConfig =
    await BillNumberConfig.findByIdAndUpdate(

      config._id,

      {
        $inc: {
          currentSequence: 1,
        },
      },

      {
        new: true,
      }
    );

  /* -------------------------------------------- */
  /* BUILD NUMBER */
  /* -------------------------------------------- */

  const sequence =
    updatedConfig.currentSequence;

  const paddedNumber =
    String(sequence).padStart(

      updatedConfig.numberPadding,

      "0"
    );

  const parts = [];

  /* COMPANY */

  if (
    updatedConfig.companyCode
  ) {

    parts.push(
      updatedConfig.companyCode
    );
  }

  /* BRANCH */

  if (
    updatedConfig.includeBranch
  ) {

    parts.push(
      updatedConfig.branchCode
    );
  }

  /* PREFIX */

  if (
    updatedConfig.prefix
  ) {

    parts.push(
      updatedConfig.prefix
    );
  }

  /* FY */

  if (
    updatedConfig.includeFY
  ) {

    parts.push(
      updatedConfig.financialYear
    );
  }

  /* NUMBER */

  parts.push(
    paddedNumber
  );

  /* SUFFIX */

  if (
    updatedConfig.suffix
  ) {

    parts.push(
      updatedConfig.suffix
    );
  }

  /* FINAL NUMBER */

  const finalBillNumber =
    parts.join(
      updatedConfig.separator
    );

 

  /* -------------------------------------------- */
  /* SAVE LAST GENERATED */
  /* -------------------------------------------- */

  await BillNumberConfig.updateOne(

    {
      _id:
        updatedConfig._id,
    },

    {
      $set: {

        lastGeneratedBillNo:
          finalBillNumber,
      },
    }
  );

  return finalBillNumber;
};

/* ------------------------------------------------ */
/* CREATE OR UPDATE CONFIG */
/* ------------------------------------------------ */

const createOrUpdateConfig = async ({

  activeCompanyId,

  activeBranchId,

  voucherType,

  prefix,

  suffix,

  separator,

  numberPadding,

  includeFY,

  includeBranch,

  resetEveryFY,

  financialYear,

  branchCode,

  companyCode,
}) => {

  /* ---------------------------------------- */
  /* FIND EXISTING */
  /* ---------------------------------------- */

  const existingConfig =
    await BillNumberConfig.findOne({

      companyId:
        new mongoose.Types.ObjectId(
          activeCompanyId
        ),

      branchId:
        new mongoose.Types.ObjectId(
          activeBranchId
        ),

      voucherType,
    });

  /* ---------------------------------------- */
  /* UPDATE */
  /* ---------------------------------------- */

  if (existingConfig) {

    existingConfig.prefix =
      prefix;

    existingConfig.suffix =
      suffix;

    existingConfig.separator =
      separator;

    existingConfig.numberPadding =
      numberPadding;

    existingConfig.includeFY =
      includeFY;

    existingConfig.includeBranch =
      includeBranch;

    existingConfig.resetEveryFY =
      resetEveryFY;

    existingConfig.financialYear =
      financialYear;

    existingConfig.branchCode =
      branchCode;

    existingConfig.companyCode =
      companyCode;

    /* IMPORTANT */

    // DO NOT CHANGE:
    // currentSequence

    await existingConfig.save();

    return existingConfig;
  }

  /* ---------------------------------------- */
  /* CREATE */
  /* ---------------------------------------- */

  const newConfig =
    await BillNumberConfig.create({

      companyId:
        activeCompanyId,

      branchId:
        activeBranchId,

      voucherType,

      prefix,

      suffix,

      separator,

      numberPadding,

      includeFY,

      includeBranch,

      resetEveryFY,

      financialYear,

      branchCode,

      companyCode,

      currentSequence: 0,

      lastGeneratedBillNo: "",

      isActive: true,
    });

  return newConfig;
};

/* ------------------------------------------------ */
/* GET CONFIG */
/* ------------------------------------------------ */

const getBillNumberConfig = async ({

  activeCompanyId,

  activeBranchId,

  voucherType,
}) => {

  const config =
    await BillNumberConfig.findOne({

      companyId:
        new mongoose.Types.ObjectId(
          activeCompanyId
        ),

      branchId:
        new mongoose.Types.ObjectId(
          activeBranchId
        ),

      voucherType,

      isActive: true,
    })

    .select({

      voucherType: 1,

      prefix: 1,

      suffix: 1,

      separator: 1,

      numberPadding: 1,

      includeFY: 1,

      includeBranch: 1,

      resetEveryFY: 1,

      financialYear: 1,

      branchCode: 1,

      companyCode: 1,

      currentSequence: 1,

      lastGeneratedBillNo: 1,
    });

  return config;
};

module.exports = {

  createOrUpdateConfig,

  getBillNumberConfig,

  generateBillNumber,
};
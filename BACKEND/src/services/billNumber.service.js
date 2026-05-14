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
  }

  return `${year - 1}-${String(
    year
  ).slice(-2)}`;
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
  /* FIND CONFIG */
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
  /* AUTO CREATE */
  /* -------------------------------------------- */

  if (!config) {

    const company =
      await Company.findById(
        companyObjectId
      );

    const branch =
      await Branch.findById(
        branchObjectId
      );

    const startingNumber = 1;

    config =
      await BillNumberConfig.create({

        companyId:
          companyObjectId,

        branchId:
          branchObjectId,

        voucherType,

        companyCode:
          company?.code ||
          company?.shortName ||
          "ERP",

        branchCode:

          branch?.name

            ?.replace(/\s+/g, "")

            ?.substring(0, 3)

            ?.toUpperCase()

          || "MAIN",

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

        currentSequence:
          startingNumber - 1,

        startingNumber,

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

    config.currentSequence =
      config.startingNumber - 1;

    await config.save();
  }

  /* -------------------------------------------- */
  /* AUTO GENERATE CHECK */
  /* -------------------------------------------- */

  if (!config.autoGenerate) {

    throw new Error(
      "Auto bill generation is disabled for this voucher type."
    );
  }

  /* -------------------------------------------- */
  /* SAFE INCREMENT */
  /* -------------------------------------------- */

  const updatedConfig =
    await BillNumberConfig.findOneAndUpdate(

      {
        _id: config._id,

        isActive: true,
      },

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

  /* MONTH */

  if (
    updatedConfig.includeMonth
  ) {

    const currentMonth =
      String(
        new Date().getMonth() + 1
      ).padStart(2, "0");

    parts.push(currentMonth);
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

  /* FINAL */

  const finalBillNumber =
    parts.join(
      updatedConfig.separator
    );

  /* -------------------------------------------- */
  /* SAVE LAST */
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
/* CREATE / UPDATE CONFIG */
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

  includeMonth,

  resetEveryFY,

  autoGenerate,

  financialYear,

  branchCode,

  companyCode,

  startingNumber,

  isActive,
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

    existingConfig.includeMonth =
      includeMonth;

    existingConfig.resetEveryFY =
      resetEveryFY;

    existingConfig.autoGenerate =
      autoGenerate;

    existingConfig.financialYear =
      financialYear;

    existingConfig.branchCode =
      branchCode;

    existingConfig.companyCode =
      companyCode;

    existingConfig.startingNumber =
      startingNumber;

    existingConfig.isActive =
      isActive;

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

      includeMonth,

      resetEveryFY,

      autoGenerate,

      financialYear,

      branchCode,

      companyCode,

      startingNumber,

      currentSequence:
        startingNumber - 1,

      lastGeneratedBillNo: "",

      isActive,
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

      includeMonth: 1,

      resetEveryFY: 1,

      autoGenerate: 1,

      financialYear: 1,

      branchCode: 1,

      companyCode: 1,

      startingNumber: 1,

      currentSequence: 1,

      lastGeneratedBillNo: 1,

      isActive: 1,
    });

  return config;
};

module.exports = {

  createOrUpdateConfig,

  getBillNumberConfig,

  generateBillNumber,
};
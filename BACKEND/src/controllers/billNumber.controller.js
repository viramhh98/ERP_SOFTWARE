// controllers/billNumber.controller.js

const {
  createOrUpdateConfig,
  getBillNumberConfig,
  generateBillNumber,
} = require(
  "../services/billNumber.service"
);

/* -------------------------------------------- */
/* GENERATE BILL NUMBER */
/* -------------------------------------------- */

const generateBillNumberController = async (
  req,
  res
) => {

  try {

    const {
      activeCompanyId,
      activeBranchId,
    } = req.user;

    const {
      voucherType,
    } = req.body;

    if (!voucherType) {

      return res.status(400).json({

        success: false,

        message:
          "voucherType is required",
      });
    }

    const billNumber =
      await generateBillNumber({

        activeCompanyId,

        activeBranchId,

        voucherType,
      });

    return res.status(200).json({

      success: true,

      message:
        "Bill number generated successfully",

      data: {
        billNumber,
      },
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
        error.message ||
        "Internal Server Error",
    });
  }
};

/* -------------------------------------------- */
/* CREATE / UPDATE CONFIG */
/* -------------------------------------------- */

const createOrUpdateBillConfigController =
  async (req, res) => {

    try {

      const {
        activeCompanyId,
        activeBranchId,
      } = req.user;

      const config =
        await createOrUpdateConfig({

          activeCompanyId,

          activeBranchId,

          ...req.body,
        });

      return res.status(200).json({

        success: true,

        message:
          "Bill configuration saved successfully",

        data: config,
      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Internal Server Error",
      });
    }
  };

/* -------------------------------------------- */
/* GET CONFIG */
/* -------------------------------------------- */

const getBillNumberConfigController =
  async (req, res) => {

    try {

      const {
        activeCompanyId,
        activeBranchId,
      } = req.user;

      /* IMPORTANT */

      const {
        voucherType,
      } = req.query;

      const config =
        await getBillNumberConfig({

          activeCompanyId,

          activeBranchId,

          voucherType,
        });

      return res.status(200).json({

        success: true,

        data: config,
      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Internal Server Error",
      });
    }
  };

module.exports = {

  generateBillNumberController,

  createOrUpdateBillConfigController,

  getBillNumberConfigController,
};
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
{
name: {
type: String,
required: true,
trim: true
},

    sku: {
      type: String,
      required: true,
      trim: true
    },

    unit: {
      type: String, // pcs, kg, liter
      required: true
    },

    price: {
      type: Number,
      default: 0
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }

},
{ timestamps: true }
);

// unique SKU per company 👉 SKU = Stock Keeping Unit Unique code to identify an item
//Item Name: iPhone 15  
// SKU: IPH15-BLK-128
// SKU: IPH15-BLK-256

itemSchema.index({ sku: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model("Item", itemSchema);












const stockSchema = new mongoose.Schema(
{
itemId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Item",
required: true
},

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true
    },

    quantity: {
      type: Number,
      default: 0
    }

},
{ timestamps: true }
);

// one stock per item per branch

stockSchema.index(
{ itemId: 1, branchId: 1, companyId: 1 },
{ unique: true }
);

module.exports = mongoose.model("Stock", stockSchema);












const stockTransactionSchema = new mongoose.Schema(
{
itemId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Item",
required: true
},

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true
    },

    type: {
      type: String,
      enum: ["IN", "OUT"],
      required: true
    },

    quantity: {
      type: Number,
      required: true
    },

    referenceType: {

type: String,
enum: [
"SALE", // selling to customer
"PURCHASE", // buying from supplier
"RETURN_IN", // customer return (stock comes back)
"RETURN_OUT", // supplier return (stock goes out)
"ADJUSTMENT", // manual correction (damage/loss)
"TRANSFER", // branch to branch transfer
"OPENING", // initial stock entry
"PAYMENT", // payment to supplier
"RECEIPT" // payment from customer
]
}

    referenceId: {
      type: mongoose.Schema.Types.ObjectId
    }

},
{ timestamps: true }
);

module.exports = mongoose.model("StockTransaction", stockTransactionSchema);




















const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
{
companyId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Company",
required: true
},

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true
    },

    partyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      required: true // supplier
    },

    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true
        },
        quantity: Number,
        price: Number,
        total: Number
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    paymentMode: {
      type: String,
      enum: ["cash", "credit"],
      default: "credit"
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "PARTIAL"],
      default: "PENDING"
    }

},
{ timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);








const ledgerSchema = new mongoose.Schema(
{
partyId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Party",
required: true
},

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch"
    },

    type: {
      type: String,
      enum: ["DEBIT", "CREDIT"],
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    referenceType: {
      type: String,
      enum: ["SALE", "PURCHASE", "PAYMENT", "RECEIPT"]
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId
    },

    description: String

},
{ timestamps: true }
);

// fast queries
ledgerSchema.index({ partyId: 1, companyId: 1 });

module.exports = mongoose.model("Ledger", ledgerSchema);
















const saleSchema = new mongoose.Schema(
{
companyId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Company",
required: true
},

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true
    },

    partyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      required: true
    },

    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true
        },

        quantity: {
          type: Number,
          required: true
        },

        price: {
          type: Number,
          required: true
        },

        total: {
          type: Number,
          required: true
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    paymentMode: {
      type: String,
      enum: ["cash", "credit"],
      default: "credit"
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "PARTIAL"],
      default: "PENDING"
    }

},
{ timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);























const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
{
companyId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Company",
required: true
},

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true
    },

    partyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      required: true // supplier
    },

    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true
        },
        quantity: Number,
        price: Number,
        total: Number
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    paymentMode: {
      type: String,
      enum: ["cash", "credit"],
      default: "credit"
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "PARTIAL"],
      default: "PENDING"
    }

},
{ timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);








const ledgerSchema = new mongoose.Schema(
{
partyId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Party",
required: true
},

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch"
    },

    type: {
      type: String,
      enum: ["DEBIT", "CREDIT"],
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    referenceType: {
      type: String,
      enum: ["SALE", "PURCHASE", "PAYMENT", "RECEIPT"]
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId
    },

    description: String

},
{ timestamps: true }
);

// fast queries
ledgerSchema.index({ partyId: 1, companyId: 1 });

module.exports = mongoose.model("Ledger", ledgerSchema);















































































const mongoose = require("mongoose");


// =======================
// 1. ITEM (MASTER)
// =======================
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  sku: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },

  unit: {
    type: String,
    enum: ["pcs", "kg", "liter", "box"],
    required: true
  },

  sellingPrice: { type: Number, default: 0, min: 0 }, // UI default
  costPrice: { type: Number, default: 0, min: 0 },   // last purchase price

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
    index: true
  },

  isActive: { type: Boolean, default: true }

}, { timestamps: true });

itemSchema.index({ sku: 1, companyId: 1 }, { unique: true });
itemSchema.index({ name: "text", sku: "text" });





























































// =======================
// 2. STOCK (BRANCH-WISE)
// =======================
const stockSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },

  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },

  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },

  quantity: { type: Number, default: 0 }

}, { timestamps: true });

stockSchema.index(
  { itemId: 1, branchId: 1, companyId: 1 },
  { unique: true }
);


// =======================
// 3. STOCK TRANSACTION (AUDIT)
// =======================
const stockTransactionSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },

  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },

  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },

  type: {
    type: String,
    enum: ["IN", "OUT"],
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  referenceType: {
    type: String,
    enum: [
      "SALE",
      "PURCHASE",
      "RETURN_IN",
      "RETURN_OUT",
      "ADJUSTMENT",
      "TRANSFER",
      "OPENING"
    ],
    required: true
  },

  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }

}, { timestamps: true });

stockTransactionSchema.index({ itemId: 1, companyId: 1 });


// =======================
// 4. PURCHASE
// =======================
const purchaseSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },

  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },

  partyId: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },

  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },

      quantity: { type: Number, required: true, min: 1 },

      price: { type: Number, required: true, min: 0 },

      total: { type: Number, required: true, min: 0 }
    }
  ],

  totalAmount: { type: Number, required: true, min: 0 },

  paymentMode: {
    type: String,
    enum: ["cash", "credit"],
    default: "credit"
  },

  status: {
    type: String,
    enum: ["PENDING", "PAID", "PARTIAL"],
    default: "PENDING"
  }

}, { timestamps: true });


// =======================
// 5. SALE
// =======================
const saleSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },

  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },

  partyId: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },

  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },

      quantity: { type: Number, required: true, min: 1 },

      price: { type: Number, required: true, min: 0 },

      total: { type: Number, required: true, min: 0 }
    }
  ],

  totalAmount: { type: Number, required: true, min: 0 },

  paymentMode: {
    type: String,
    enum: ["cash", "credit"],
    default: "credit"
  },

  status: {
    type: String,
    enum: ["PENDING", "PAID", "PARTIAL"],
    default: "PENDING"
  }

}, { timestamps: true });


// =======================
// 6. LEDGER (MONEY FLOW)
// =======================
const ledgerSchema = new mongoose.Schema({
  partyId: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },

  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },

  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },

  type: {
    type: String,
    enum: ["DEBIT", "CREDIT"],
    required: true
  },

  amount: { type: Number, required: true, min: 0 },

  referenceType: {
    type: String,
    enum: ["SALE", "PURCHASE", "PAYMENT", "RECEIPT"],
    required: true
  },

  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  description: String

}, { timestamps: true });

ledgerSchema.index({ partyId: 1, companyId: 1 });


// =======================
// EXPORTS
// =======================
module.exports = {
  Item: mongoose.model("Item", itemSchema),
  Stock: mongoose.model("Stock", stockSchema),
  StockTransaction: mongoose.model("StockTransaction", stockTransactionSchema),
  Purchase: mongoose.model("Purchase", purchaseSchema),
  Sale: mongoose.model("Sale", saleSchema),
  Ledger: mongoose.model("Ledger", ledgerSchema)
};











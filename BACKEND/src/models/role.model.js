// policybased access control system for ERP rules and permissions management
// Role model definition using Mongoose
// Each role will have a unique name and can be assigned to multiple users
// A role can have multiple permissions associated with it,
//purchase permission, sales permission, inventory permission, etc. all will have crud operations 

const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  permissions: [
    {
      module: {
        type: String,
        required: true
      },
      actions: [
        {
          type: String
        }
      ]
    }
  ],

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  }

}, { timestamps: true });

roleSchema.index({ name: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model('Role', roleSchema);
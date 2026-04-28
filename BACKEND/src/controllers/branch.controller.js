const branchService = require("../services/branch.service");

const createBranch = async (req, res) => {
  try {
    const { name, address } = req.body;
    
    // Service ko call karein aur destructured data pass karein
    const branch = await branchService.createBranch({
      name,
      address,
      userId: req.user.userId,
      activeCompanyId: req.user.activeCompanyId,
      activeBranchId: req.user.activeBranchId
    });

    return res.status(201).json(branch);
  } catch (error) {

    return res.status(500).json({ message: error.message || "Error creating branch" });
  }
};


const getBranches = async (req, res) => {
  try {
    const { companyId } = req.params;

    const branches = await branchService.getBranchesByCompany(companyId);

    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching branches" });
  }
};

module.exports = {
  createBranch,
  getBranches,
};

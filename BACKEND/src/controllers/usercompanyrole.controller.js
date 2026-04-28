const {getUserRoleContext,getallCompanyBranchesService,getUserByRoleService,updateUserRoleService,getUserByCompanyBranchService} = require("../services/userCompanyRole.service");

const getMyRole = async (req, res) => {
  try {
    const userId = req.user.userId;
    const companyId=req.user.activeCompanyId;
    const branchId=req.user.activeBranchId;
    
    const roleContext = await getUserRoleContext({
      userId,
      companyId,
      branchId
    });

    
    if (!roleContext) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json(roleContext);
  } catch (error) {
    res.status(500).json({ message: "Error fetching role" });
  }
};


const getallCompanyBranches = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Note: Make sure your service populates both companyId AND branchId
    const rawBranches = await getallCompanyBranchesService({ userId });

    const groupedData = rawBranches.reduce((acc, curr) => {
      const companyId = curr.companyId._id.toString();
      const companyName = curr.companyId.name;

      // 1. Check if company is already in our list
      let companyGroup = acc.find(item => item.companyId === companyId);

      if (!companyGroup) {
        companyGroup = {
          companyId: companyId,
          companyName: companyName, // Frontend display ke liye
          branches: []
        };
        acc.push(companyGroup);
      }

      // 2. Agar branchId null nahi hai, toh uska ID aur Name dono bhejien
      if (curr.branchId !== null) {
        // Ensure branchId is populated in your service to get the name
        companyGroup.branches.push({
          id: curr.branchId._id || curr.branchId, // ID for backend
          name: curr.branchId.name || "Main Branch" // Name for frontend
        });
      }

      return acc;
    }, []);

    res.json(groupedData);
  } catch (error) {

    res.status(500).json({ message: "Error fetching branches" });
  }
};


const getUserByRole = async (req, res) => {
  try {
    const companyId = req.user.activeCompanyId;
    const roleId = req.params.roleId;
    const Users = await getUserByRoleService({ companyId, roleId });
    res.json(Users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users by role" });
  }
};


const getUserByCompanyBranch = async (req, res) => {
  try {
    const companyId = req.user.activeCompanyId;
    const branchId = req.user.activeBranchId;
    const Users = await getUserByCompanyBranchService({ companyId, branchId });
    res.json(Users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users by company branch" });
  }
};

const updateUserRole = async (req, res) => {
  const { userId, curr_roleId, new_roleId } = req.body;
  const companyId = req.user.activeCompanyId;
  const User=await updateUserRoleService({ userId, companyId, curr_roleId, new_roleId });
  res.json(User);
}

    

module.exports ={getMyRole,getallCompanyBranches,getUserByRole,updateUserRole,getUserByCompanyBranch};
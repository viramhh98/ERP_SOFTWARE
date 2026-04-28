const activeBranch = (req, res, next) => {
  const branchId = req.headers["activebranchid"] || null;

  // if (!branchId) {
  //   return res.status(400).json({
  //     message: "No active branch selected",
  //     code: "NO_ACTIVE_BRANCH"
  //   });
  // }

  req.user.activeBranchId = branchId;

  next();
};

module.exports = activeBranch;
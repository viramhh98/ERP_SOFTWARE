const validateCreateEmployee = (req, res, next) => {
  const { name, email, password, companyId, assignments } = req.body;

  if (!name || !email || !password || !companyId) {
    return res.status(400).json({
      message: "Missing required fields"
    });
  }

  if (!Array.isArray(assignments) || assignments.length === 0) {
    return res.status(400).json({
      message: "Assignments must be a non-empty array"
    });
  }

  for (const a of assignments) {
    if (!a.branchId || !a.roleId) {
      return res.status(400).json({
        message: "Each assignment must have branchId and roleId"
      });
    }
  }

  next();
};

module.exports = {
  validateCreateEmployee
};
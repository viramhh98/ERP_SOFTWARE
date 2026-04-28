const activeCompany = (req, res, next) => {
  const companyId = req.headers["activecompanyid"];
  req.user = {
    ...req.user,
    activeCompanyId: companyId
  };

  next();
};

module.exports = activeCompany;
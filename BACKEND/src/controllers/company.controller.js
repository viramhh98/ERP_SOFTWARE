const companyService = require("../services/company.service");

const createCompany = async (req, res) => {
  try {
    const userId = req.user.userId;

    const company = await companyService.createCompany(
      req.body,
      userId
    );
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error creating company" });
  }
};


const getCompanies = async (req, res) => {
  try {
    const userId = req.user.userId;
    const companies = await companyService.getCompanies(userId);
    res.status(200).json(companies);
  } 
  catch (error) {
    res.status(500).json({ message: "Error fetching companies" });
  }
};


const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const userId = req.user.userId;

    const company = await companyService.updateCompany(companyId, userId, req.body);
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error updating company" });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const userId = req.user.userId;

    await companyService.deleteCompany(companyId, userId);
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting company" });
  }
};

module.exports = { createCompany, getCompanies, updateCompany, deleteCompany };

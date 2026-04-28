const employeeService = require("../services/createEmployee.service");

const createEmployee = async (req, res) => {
  try {
    const result = await employeeService.createEmployee(req.body);
    
    res.status(201).json({
      message: "Employee created successfully",
      data: result
    });
  } catch (error) {
    if (error.message.includes("roles do not belong")) {
      return res.status(400).json({ message: error.message });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate role assignment"
      });
    }

    res.status(500).json({
      message: "Error creating employee"
    });
  }
};

module.exports = {
  createEmployee
};
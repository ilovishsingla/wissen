const Employee = require('../models/Employee');

exports.createEmployee = async (req, res, next) => {
  try {
    const { name, email, batch, department } = req.validated;

    const employee = new Employee({
      name,
      email,
      batch,
      department,
    });

    await employee.save();
    res.status(201).json({ data: employee, message: 'Employee created successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find({ isActive: true }).populate('designatedSeatId');
    res.status(200).json({ data: employees });
  } catch (error) {
    next(error);
  }
};

exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('designatedSeatId');
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json({ data: employee });
  } catch (error) {
    next(error);
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.validated, { new: true });
    res.status(200).json({ data: employee, message: 'Employee updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    await Employee.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ message: 'Employee deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

const leaveService = require('../services/leaveService');
const Leave = require('../models/Leave');

exports.addLeave = async (req, res, next) => {
  try {
    const { employeeId, date, leaveType } = req.validated;
    const leave = await leaveService.addLeave(employeeId, date, leaveType);
    res.status(201).json({ data: leave, message: 'Leave added successfully' });
  } catch (error) {
    next(error);
  }
};

exports.removeLeave = async (req, res, next) => {
  try {
    await leaveService.removeLeave(req.params.id);
    res.status(200).json({ message: 'Leave removed successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getEmployeeLeaves = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;
    const leaves = await leaveService.getEmployeeLeaves(
      employeeId,
      new Date(startDate),
      new Date(endDate)
    );
    res.status(200).json({ data: leaves });
  } catch (error) {
    next(error);
  }
};

exports.getAllLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find({ status: 'approved' }).populate('employeeId');
    res.status(200).json({ data: leaves });
  } catch (error) {
    next(error);
  }
};

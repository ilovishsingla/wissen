const Leave = require('../models/Leave');
const Booking = require('../models/Booking');
const Employee = require('../models/Employee');

class LeaveService {
  async addLeave(employeeId, date, leaveType = 'casual') {
    // Verify employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    // Check if leave already exists for this date
    const existingLeave = await Leave.findOne({ employeeId, date });
    if (existingLeave) {
      throw new Error('Leave already exists for this date');
    }

    const leave = new Leave({
      employeeId,
      date: new Date(date),
      leaveType,
      status: 'approved',
    });

    await leave.save();

    // Cancel any bookings for this date
    await Booking.updateMany(
      { employeeId, date: new Date(date), status: 'confirmed' },
      { status: 'cancelled' }
    );

    return leave;
  }

  async removeLeave(leaveId) {
    return Leave.findByIdAndDelete(leaveId);
  }

  async getEmployeeLeaves(employeeId, startDate, endDate) {
    return Leave.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
      status: 'approved',
    });
  }

  async isEmployeeOnLeave(employeeId, date) {
    const leave = await Leave.findOne({
      employeeId,
      date: new Date(date),
      status: 'approved',
    });

    return !!leave;
  }
}

module.exports = new LeaveService();

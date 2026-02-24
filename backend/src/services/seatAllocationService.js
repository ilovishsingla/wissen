const Seat = require('../models/Seat');
const Employee = require('../models/Employee');
const Leave = require('../models/Leave');
const Booking = require('../models/Booking');
const { isEmployeeWorkingDay } = require('../utils/batchCalculator');

class SeatAllocationService {
  async initializeSeats() {
    const existingSeats = await Seat.countDocuments();
    if (existingSeats > 0) return;

    const seats = [];
    // 40 designated seats
    for (let i = 1; i <= 40; i++) {
      seats.push({
        seatNumber: `D${i}`,
        type: 'designated',
        floor: Math.ceil(i / 10),
        zone: String.fromCharCode(65 + ((i - 1) % 4)),
      });
    }

    // 10 flooder seats
    for (let i = 1; i <= 10; i++) {
      seats.push({
        seatNumber: `F${i}`,
        type: 'flooder',
        floor: 5,
        zone: 'Common',
      });
    }

    await Seat.insertMany(seats);
  }

  async allocateDesignatedSeats() {
    const employees = await Employee.find({ isActive: true });
    const designatedSeats = await Seat.find({ type: 'designated', assignedEmployeeId: null });

    for (let i = 0; i < employees.length && i < designatedSeats.length; i++) {
      const employee = employees[i];
      const seat = designatedSeats[i];

      employee.designatedSeatId = seat._id;
      seat.assignedEmployeeId = employee._id;
      seat.status = 'booked';

      await employee.save();
      await seat.save();
    }
  }

  async getAvailableSeatsForDate(date, batch) {
    const bookedSeats = await Booking.find({
      date: { $eq: new Date(date) },
      status: 'confirmed',
    }).select('seatId');

    const bookedSeatIds = bookedSeats.map(b => b.seatId.toString());

    // Get employees on leave
    const leaveRecords = await Leave.find({
      date: { $eq: new Date(date) },
      status: 'approved',
    }).select('employeeId');

    const onLeaveEmployeeIds = leaveRecords.map(l => l.employeeId.toString());

    // Find available seats
    let availableSeats = await Seat.find({
      _id: { $nin: bookedSeatIds },
      status: { $ne: 'blocked' },
    });

    // For designated seats, check if employee is working that day
    availableSeats = availableSeats.filter(seat => {
      if (seat.type === 'designated') {
        if (onLeaveEmployeeIds.includes(seat.assignedEmployeeId?.toString())) {
          return true;
        }
        return false;
      }
      return true; // flooder seats always available
    });

    return availableSeats;
  }

  async getWeeklySeatAllocation(startDate, batch) {
    const allocation = {};
    const currentDate = new Date(startDate);

    for (let i = 0; i < 7; i++) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const isWorkingDay = isEmployeeWorkingDay(currentDate, batch);

      if (isWorkingDay) {
        allocation[dateKey] = await this.getAvailableSeatsForDate(currentDate, batch);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return allocation;
  }
}

module.exports = new SeatAllocationService();

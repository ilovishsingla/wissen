const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const Holiday = require('../models/Holiday');
const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const { isEmployeeWorkingDay } = require('../utils/batchCalculator');

class BookingService {
  async createBooking(employeeId, seatId, date, bookingType) {
    // Validation checks
    await this.validateBooking(employeeId, seatId, date, bookingType);

    const booking = new Booking({
      employeeId,
      seatId,
      date: new Date(date),
      bookingType,
      status: 'confirmed',
    });

    await booking.save();
    return booking.populate(['employeeId', 'seatId']);
  }

  async validateBooking(employeeId, seatId, date, bookingType) {
    const bookingDate = new Date(date);
    const today = new Date();

    // Check if date is in past
    if (bookingDate < today) {
      throw new Error('Cannot book for past dates');
    }

    // Check if holiday
    const isHoliday = await Holiday.findOne({ date: bookingDate });
    if (isHoliday) {
      throw new Error('Booking not allowed on holidays');
    }

    // Check employee existence
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    // Check if employee is on leave
    const leaveRecord = await Leave.findOne({
      employeeId,
      date: bookingDate,
      status: 'approved',
    });

    if (leaveRecord && bookingType === 'designated') {
      throw new Error('Cannot book designated seat while on leave');
    }

    // Check seat existence
    const seat = await Seat.findById(seatId);
    if (!seat) {
      throw new Error('Seat not found');
    }

    // For flooder seats, check if booking is after 3 PM for next day
    if (bookingType === 'flooder') {
      const currentHour = new Date().getHours();
      const isNextDay = bookingDate.toDateString() === new Date(new Date().setDate(new Date().getDate() + 1)).toDateString();

      if (!isNextDay || currentHour < 15) {
        throw new Error('Flooder seats can only be booked after 3 PM for next day');
      }
    }

    // Check if employee has already booked for this date
    const existingBooking = await Booking.findOne({
      employeeId,
      date: bookingDate,
      status: 'confirmed',
    });

    if (existingBooking) {
      throw new Error('Employee already has a booking for this date');
    }

    // Check if seat is available
    if (seat.status === 'blocked') {
      throw new Error('Seat is blocked');
    }

    // Check if employee is working that day
    if (!isEmployeeWorkingDay(bookingDate, employee.batch)) {
      throw new Error('Employee not scheduled to work on this day');
    }
  }

  async cancelBooking(bookingId) {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'cancelled' },
      { new: true }
    );

    return booking;
  }

  async getEmployeeBookings(employeeId, startDate, endDate) {
    return Booking.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
      status: { $in: ['confirmed', 'completed'] },
    }).populate(['seatId']);
  }

  async getBookingsForDate(date) {
    return Booking.find({
      date: new Date(date),
      status: 'confirmed',
    }).populate(['employeeId', 'seatId']);
  }
}

module.exports = new BookingService();

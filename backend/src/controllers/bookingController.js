const bookingService = require('../services/bookingService');
const Booking = require('../models/Booking');

exports.createBooking = async (req, res, next) => {
  try {
    const { employeeId, seatId, date, bookingType } = req.validated;
    const booking = await bookingService.createBooking(employeeId, seatId, date, bookingType);
    res.status(201).json({ data: booking, message: 'Booking created successfully' });
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id);
    res.status(200).json({ data: booking, message: 'Booking cancelled successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getEmployeeBookings = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;
    const bookings = await bookingService.getEmployeeBookings(
      employeeId,
      new Date(startDate),
      new Date(endDate)
    );
    res.status(200).json({ data: bookings });
  } catch (error) {
    next(error);
  }
};

exports.getBookingsForDate = async (req, res, next) => {
  try {
    const { date } = req.query;
    const bookings = await bookingService.getBookingsForDate(date);
    res.status(200).json({ data: bookings, count: bookings.length });
  } catch (error) {
    next(error);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ status: 'confirmed' }).populate(['employeeId', 'seatId']);
    res.status(200).json({ data: bookings });
  } catch (error) {
    next(error);
  }
};

const Seat = require('../models/Seat');
const seatAllocationService = require('../services/seatAllocationService');

exports.getAllSeats = async (req, res, next) => {
  try {
    const seats = await Seat.find().populate('assignedEmployeeId');
    res.status(200).json({ data: seats });
  } catch (error) {
    next(error);
  }
};

exports.getSeatsByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const seats = await Seat.find({ type }).populate('assignedEmployeeId');
    res.status(200).json({ data: seats });
  } catch (error) {
    next(error);
  }
};

exports.getAvailableSeats = async (req, res, next) => {
  try {
    const { date, batch } = req.query;
    const availableSeats = await seatAllocationService.getAvailableSeatsForDate(date, batch);
    res.status(200).json({ data: availableSeats, count: availableSeats.length });
  } catch (error) {
    next(error);
  }
};

exports.getWeeklySeatAllocation = async (req, res, next) => {
  try {
    const { startDate, batch } = req.query;
    const allocation = await seatAllocationService.getWeeklySeatAllocation(startDate, batch);
    res.status(200).json({ data: allocation });
  } catch (error) {
    next(error);
  }
};

exports.initializeSeats = async (req, res, next) => {
  try {
    await seatAllocationService.initializeSeats();
    res.status(201).json({ message: 'Seats initialized successfully' });
  } catch (error) {
    next(error);
  }
};

exports.allocateDesignatedSeats = async (req, res, next) => {
  try {
    await seatAllocationService.allocateDesignatedSeats();
    res.status(200).json({ message: 'Designated seats allocated successfully' });
  } catch (error) {
    next(error);
  }
};

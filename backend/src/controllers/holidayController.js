const Holiday = require('../models/Holiday');

exports.addHoliday = async (req, res, next) => {
  try {
    const { date, name, type } = req.validated;
    const holiday = new Holiday({ date: new Date(date), name, type });
    await holiday.save();
    res.status(201).json({ data: holiday, message: 'Holiday added successfully' });
  } catch (error) {
    next(error);
  }
};

exports.removeHoliday = async (req, res, next) => {
  try {
    await Holiday.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Holiday removed successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getAllHolidays = async (req, res, next) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });
    res.status(200).json({ data: holidays });
  } catch (error) {
    next(error);
  }
};

exports.getHolidaysForMonth = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const holidays = await Holiday.find({
      date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
    });
    res.status(200).json({ data: holidays });
  } catch (error) {
    next(error);
  }
};

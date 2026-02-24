const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({ error: errorMessage });
    }

    req.validated = value;
    next();
  };
};

const schemas = {
  createEmployee: Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().email().required(),
    batch: Joi.string().valid('batch1', 'batch2').required(),
    department: Joi.string(),
  }),

  createBooking: Joi.object({
    employeeId: Joi.string().required(),
    seatId: Joi.string().required(),
    date: Joi.date().greater('now').required(),
    bookingType: Joi.string().valid('designated', 'flooder').required(),
  }),

  addLeave: Joi.object({
    employeeId: Joi.string().required(),
    date: Joi.date().required(),
    leaveType: Joi.string().valid('personal', 'sick', 'casual', 'other'),
  }),

  addHoliday: Joi.object({
    date: Joi.date().required(),
    name: Joi.string().required(),
    type: Joi.string().valid('national', 'regional', 'company'),
  }),
};

module.exports = { validateRequest, schemas };

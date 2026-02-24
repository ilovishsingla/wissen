const express = require('express');
const { validateRequest, schemas } = require('../middleware/validation');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.post('/', validateRequest(schemas.createBooking), bookingController.createBooking);
router.get('/', bookingController.getAllBookings);
router.get('/date', bookingController.getBookingsForDate);
router.get('/employee/:employeeId', bookingController.getEmployeeBookings);
router.put('/:id/cancel', bookingController.cancelBooking);

module.exports = router;

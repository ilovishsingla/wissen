const express = require('express');
const employeeRoutes = require('./employeeRoutes');
const seatRoutes = require('./seatRoutes');
const bookingRoutes = require('./bookingRoutes');
const leaveRoutes = require('./leaveRoutes');
const holidayRoutes = require('./holidayRoutes');

const router = express.Router();

router.use('/employees', employeeRoutes);
router.use('/seats', seatRoutes);
router.use('/bookings', bookingRoutes);
router.use('/leaves', leaveRoutes);
router.use('/holidays', holidayRoutes);

module.exports = router;

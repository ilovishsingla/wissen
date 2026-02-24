const express = require('express');
const seatController = require('../controllers/seatController');

const router = express.Router();

router.get('/', seatController.getAllSeats);
router.get('/type/:type', seatController.getSeatsByType);
router.get('/available', seatController.getAvailableSeats);
router.get('/allocation/weekly', seatController.getWeeklySeatAllocation);
router.post('/initialize', seatController.initializeSeats);
router.post('/allocate-designated', seatController.allocateDesignatedSeats);

module.exports = router;

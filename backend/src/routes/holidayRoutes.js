const express = require('express');
const { validateRequest, schemas } = require('../middleware/validation');
const holidayController = require('../controllers/holidayController');

const router = express.Router();

router.post('/', validateRequest(schemas.addHoliday), holidayController.addHoliday);
router.get('/', holidayController.getAllHolidays);
router.get('/month', holidayController.getHolidaysForMonth);
router.delete('/:id', holidayController.removeHoliday);

module.exports = router;

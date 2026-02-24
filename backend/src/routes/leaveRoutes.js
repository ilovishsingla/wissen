const express = require('express');
const { validateRequest, schemas } = require('../middleware/validation');
const leaveController = require('../controllers/leaveController');

const router = express.Router();

router.post('/', validateRequest(schemas.addLeave), leaveController.addLeave);
router.get('/', leaveController.getAllLeaves);
router.get('/employee/:employeeId', leaveController.getEmployeeLeaves);
router.delete('/:id', leaveController.removeLeave);

module.exports = router;

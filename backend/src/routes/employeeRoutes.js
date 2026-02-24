const express = require('express');
const { validateRequest, schemas } = require('../middleware/validation');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

router.post('/', validateRequest(schemas.createEmployee), employeeController.createEmployee);
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;

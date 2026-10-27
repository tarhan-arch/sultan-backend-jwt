const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController.js');
const auth = require('../middlewares/auth');
const { validateCategoryCreate, validateCategoryUpdate } = require('../middlewares/validation');

router.get('/', categoryController.getAll);            // public
router.get('/:id', categoryController.getById);        // public
router.post('/', auth, validateCategoryCreate, categoryController.create); // protected
router.put('/:id', auth, validateCategoryUpdate, categoryController.update); // protected
router.delete('/:id', auth, categoryController.remove); // protected

module.exports = router;



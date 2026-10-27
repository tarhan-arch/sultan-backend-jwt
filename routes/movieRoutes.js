const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

const auth = require('../middlewares/auth');

const { validateMovieCreate, validateCategoryUpdate } = require('../middlewares/validation');
const { get } = require('./authRoutes');

// rute public (tidak perlu token)

router.get('/', movieController.getAll);
router.get('/:id', movieController.getById);

// rute protected (lewat middlewares Auth)
router.post('/', auth, validateMovieCreate, movieController.create);
router.put('/:id', auth, validateCategoryUpdate, movieController.update);
router.delete('/:id', auth, movieController.remove);


module.exports = router;
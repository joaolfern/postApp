const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController')

router.get('/', PostController.index);
router.post('/', PostController.store);
router.get('/:id', PostController.show);
router.delete('/:id', PostController.destroy);
router.patch('/:id', PostController.update);

module.exports = router;
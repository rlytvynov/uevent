const Router = require('express')
const router = new Router()
const controller = require('../controllers/commentController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/comments', controller.getComments);
router.get('/comments/:id', controller.getCommentById);

router.get('/comments/event/:eventId',controller.getCommentsByEventId);

router.post('/comments/event/:eventId',authMiddleware, controller.createComment);
module.exports = router
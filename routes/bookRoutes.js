import express from 'express';
import {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import { rbacMiddleware } from '../middlewares/rbacMiddleware.js';
import { cacheMiddleware } from '../middlewares/cacheMiddleware.js';
const router = express.Router();
router.post('/', rbacMiddleware(['Admin']), createBook);
router.get('/', cacheMiddleware, getAllBooks);
router.put('/:id', rbacMiddleware(['Admin']), updateBook);
router.delete('/:id', rbacMiddleware(['Admin']), deleteBook);
export default router;

import express from 'express';
import { getAllUsers, createUser } from '../controllers/userController.js';
import { authMiddleware , adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllUsers);
router.post('/', authMiddleware, adminMiddleware, createUser);

export default router;
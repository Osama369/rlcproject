import express from 'express';
import {
    adminLogin,
    register,
    login,
} from '../controllers/authController.js';
import {
    authMiddleware,
    adminMiddleware,
} from '../middlewares/authMiddleware.js';

// Authentication Router
const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/admin' , adminLogin);

export default authRouter;




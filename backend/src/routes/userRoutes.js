import express from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  initializeUserBalance,
  deductUserBalance,
  deleteUser,
  updateUser,
  toggleUserActiveStatus,
} from "../controllers/userController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();
// users routes 
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.post("/create-user", authMiddleware, adminMiddleware, createUser);
router.get("/:id", authMiddleware, getUserById);
router.patch("/:id", authMiddleware, adminMiddleware, updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);
router.patch(
  "/:id/active",
  authMiddleware,
  adminMiddleware,
  toggleUserActiveStatus
);
router.patch(
  "/:id/balance/initialize",
  authMiddleware,
  adminMiddleware,
  initializeUserBalance
);
router.patch(
  "/:id/balance/deduct",
  authMiddleware,
  deductUserBalance
);
export default router;

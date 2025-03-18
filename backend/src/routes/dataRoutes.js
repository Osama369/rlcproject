import express from "express";
import {
    addDataForTimeSlot,
    getDataForDate,
} from "../controllers/dataController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const dataRouter = express.Router();

dataRouter.post("/add", authMiddleware, addDataForTimeSlot);
dataRouter.post("/get", authMiddleware, getDataForDate);

export default dataRouter;
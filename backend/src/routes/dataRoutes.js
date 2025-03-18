import express from "express";
import {
    addDataForTimeSlot,
    getDataForDate,
} from "../controllers/dataController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const dataRouter = express.Router();

dataRouter.post("/add-data", authMiddleware, addDataForTimeSlot);
dataRouter.get("/get-data", authMiddleware, getDataForDate);

export default dataRouter;
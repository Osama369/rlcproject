import express from "express";
import {
    addDataForTimeSlot,
    getDataForDate,
    getAllDocuments,
    deleteDataObjectById
} from "../controllers/dataController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const dataRouter = express.Router();

dataRouter.post("/add-data", authMiddleware, addDataForTimeSlot);
dataRouter.get("/get-data", authMiddleware, getDataForDate);
dataRouter.get("/get-all-documents",  getAllDocuments);
dataRouter.delete("/delete-data/:id",  deleteDataObjectById);

// dataRouter.get('/get-data/:id', authMiddleware, getDataById);

export default dataRouter;
import Data from "../models/Data.js";

const addDataForTimeSlot = async (req, res) => {
    const { timeSlot, data } = req.body;
    try {
        const newData = new Data({ userId : req.userId, timeSlot, data });
        await newData.save();
        res.status(201).json({ message: "Data added successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
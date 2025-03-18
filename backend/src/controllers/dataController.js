import Data from "../models/Data.js";

const addDataForTimeSlot = async (req, res) => {
    const { timeSlot, data } = req.body;
    try {
        const newData = new Data({ userId : req.user.id, timeSlot, data , date : new Date().toISOString().slice(0, 10) });
        await newData.save();
        res.status(201).json({ message: "Data added successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getDataForDate = async (req , res) => {
    const { date } = req.body;
    if(!date){
        return res.status(400).json({ error: "Date is required" });
    }
    try {
        const data = await Data.find({ userId : req.userId , date });
        if(!data){
            return res.status(404).json({ error: "No data associated to this date" });
        }
        return res.status(200).json({ data });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    
}

export {
    addDataForTimeSlot,
    getDataForDate,
}
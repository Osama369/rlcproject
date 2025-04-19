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

const deleteDataObjectById = async (req , res) => {
    const { id } = req.params;

    if(!id){
        return res.status(400).json({ error: "Id is required" });
    }

    try {
        const data = await Data.findByIdAndDelete(id);
        if(!data){
            return res.status(404).json({ error: "No data associated to this id" });
        }
        return res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const getAllDocuments = async (req , res) => {
    try {
        const data = await Data.find();
        if(!data){
            return res.status(404).json({ error: "No data associated to this user" });
        }
        return res.status(200).json({ data });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export {
    addDataForTimeSlot,
    getDataForDate,
    deleteDataObjectById,
    getAllDocuments
}
import Data from "../models/Data.js";

const addDataForTimeSlot = async (req, res) => {
    const { timeSlot, data } = req.body;
    try {
        const newData = new Data({ userId : req.user.id, timeSlot, data , date : new Date().toISOString().slice(0, 10) });
        await newData.save();
        res.status(201).json({ message: "Data added successfully" , newData });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


// getDataForDate is used to get data for a specific date or slot
// and is used in the frontend to get data for a specific date or slot
const getDataForDate = async (req, res) => {   
    const { date, timeSlot } = req.query;
  
    if (!date || !timeSlot) {
      return res.status(400).json({ error: "Both date and timeSlot are required" });
    }
  
    try {
      const data = await Data.find({
        userId: req.user.id,
        date,
        timeSlot,
      });
  
      if (!data || data.length === 0) {
        return res.status(404).json({ error: "No data found for the given date and timeSlot" });
      }
  
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


   
  
      
    

export {
    addDataForTimeSlot,
    getDataForDate,
    // getDataById, 
}
    
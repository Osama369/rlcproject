import mongoose, { Mongoose } from "mongoose";

const dataSchema = new mongoose.Schema({
    userId: {
        type : Schema.Types.ObjectId,
        ref: 'User',
    }, 
    timeSlot : {
        type : String,
        required : true,
    }, 
    data : [
        {
            
        }
    ]
} , {
    timestamps: true,
});

const Data = mongoose.model("Data", dataSchema);
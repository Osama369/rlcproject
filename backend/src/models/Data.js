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
    date : {
        type : Date,
        reqquired : true,
        default : Date.now,
    },
    data : [
        {
            uniqueId : {
                type : Number,
                required : true,
            },
            firstPrice : {
                type : Number,
                required : true
            },
            secondPrice : {
                type : Number,
                required : true
            }
        }
    ]
} , {
    timestamps: true,
});

export default mongoose.model("Data", dataSchema);
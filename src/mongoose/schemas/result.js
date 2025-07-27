import mongoose from "mongoose";

const resultSchema = mongoose.Schema({
    _id: Number,
    img: String,
    type: String
},
{ timestamps: true }
)

export const Result = mongoose.model('Result', resultSchema)

import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
    _id: Number,
    name: String,
    degree: {
        type: String,
        enum: ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'],
        default: 'a1'
    }
})

export const Group = mongoose.model('Group', groupSchema)
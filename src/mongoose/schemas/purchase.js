import mongoose from "mongoose";

const progressSchema = mongoose.Schema({
    _id: Number,
    userId: Number,
    courseId: Number,
})

export const Progress = mongoose.model('Progress', progressSchema);
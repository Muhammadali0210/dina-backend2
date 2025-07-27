import mongoose from "mongoose";

const progressSchema = mongoose.Schema({
    _id: Number,
    userId: Number,
    lessonId: Number,
    isCompleted: {
        type: Boolean,
        default: false
    }
})

export const Progress = mongoose.model('Progress', progressSchema);
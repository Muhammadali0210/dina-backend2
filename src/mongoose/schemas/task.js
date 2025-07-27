import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    _id: Number,
    text: String,
    textUz: String,
    image: String,
    lessonId: Number,
    completedUser: [Number]
},
{ timestamps: true })

export const Task = mongoose.model('Task', taskSchema)
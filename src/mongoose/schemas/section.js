import mongoose from "mongoose";

const sectionSchema = mongoose.Schema({
    _id: Number,
    title: String,
    position: Number,
    courseId: Number,
    lessonId: [ Number ]
})

export const Section = mongoose.model('Section', sectionSchema)
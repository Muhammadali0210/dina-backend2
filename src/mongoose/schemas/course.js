import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
    {
        _id: Number,
        title: String,
        description: String,
        learning: String,
        requirements: String,
        level: String,
        language: String,
        category: String,
        oldPrice: Number,
        currentPrice: Number,
        previewImage: String,
        published: {type: Boolean, default: false}
    }
)
export const Course = mongoose.model('Course', CourseSchema)  
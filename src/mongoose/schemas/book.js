import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    _id: Number,
    name: String,
    file: Buffer,
    category: {
        type: String,
        enum: ['beginner', 'middle', 'strong', 'topik'],
        default: 'beginner'
    }
})

export const Book = mongoose.model('Book', bookSchema)
import mongoose from "mongoose";

const newsSchema = mongoose.Schema({
    _id: Number,
    name: String,
    description: String,
    image: String,
},
{ timestamps: true })

export const News = mongoose.model('News', newsSchema)
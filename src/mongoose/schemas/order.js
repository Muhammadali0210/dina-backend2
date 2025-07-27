import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    _id: Number,
    firstName: String,
    lastName: String,
    phone: String,
    variant: String,
    type: String,
    time: String,
},
{ timestamps: true }
)

export const Order = mongoose.model('Order', orderSchema)

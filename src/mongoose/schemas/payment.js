import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
    _id: Number,
    status: Boolean,
    amount: Number,
    month: Date,
    payment_type: String,
    student_id: Number,
    group_id: Number
})

export const Payment = mongoose.model('Payment', paymentSchema)

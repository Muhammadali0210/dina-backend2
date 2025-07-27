import mongoose, { Schema } from "mongoose";

const attendanceSchema = mongoose.Schema({
    _id: Number,
    status: Boolean,
    homework: Boolean,
    date: Date,
    student_id: Number,
    group_id: Number,
    is_active: Boolean
})

export const Attendance = mongoose.model('Attendance', attendanceSchema)

const db = [
    {
        status: true,
        homework: true,
        date: "02.11.2024",
        student_id: 5,
        group_id: 1,
        is_active: true
    },
    {
        status: true,
        homework: true,
        date: "02.11.2024",
        student_id: 7,
        group_id: 1,
        is_active: true
    }
]
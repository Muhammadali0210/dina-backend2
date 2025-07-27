import { Router } from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { User } from "../mongoose/schemas/user.js";
import { Attendance } from "../mongoose/schemas/attendance.js";
import { Group } from "../mongoose/schemas/group.js";

const router = Router();

router.get('/profile/:id', verifyToken, async (req, res) => {
    const id = req.params.id;

    const user = await User.findOne({_id: id});
    if(!user) return res.status(404).send({message: "Bunday foydalanuvchi topilmadi"});
    const groupName = await Group.findOne({ _id: user.group_ids[0] });

    const data = {
        first_name: user.first_name,
        last_name: user.last_name,
        login: user.login,
        phone: user.phone,
        telegram_id: user.telegram_id,
        group_name: groupName.name
    }
    const userData = {
        data: data,
        attendance: []
    }
    const attendanceRecords = await Attendance.find({ student_id: id });
    const attendance = attendanceRecords.map(record => ({
        date: record.date,
        status: record.status,
        homework: record.homework,
    }));
    userData.attendance = attendance;
    res.send(userData);
})

export default router
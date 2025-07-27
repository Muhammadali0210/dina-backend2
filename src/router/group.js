import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { groupValidation } from "../utils/validation.js";
import { Group } from "../mongoose/schemas/group.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";
import { User } from "../mongoose/schemas/user.js";

const router = Router();

router.get('/group', async (req, res) => {
    const data = await Group.find();
    res.send(data);
})

router.get('/group/teacher', verifyAdminOrTeacher, async (req, res) => {
    const teacherId = req.user.id;
    try {
        if(req.user.role == 'admin'){
            const groups = await Group.aggregate([
                {
                    $lookup: {
                        from: 'users', // User kolleksiyasi nomi
                        localField: '_id', // Group modeli `_id` maydoni
                        foreignField: 'group_ids', // User modeli `group_ids` maydoni
                        as: 'students', // Ulangan foydalanuvchilar saqlanadi
                    },
                },
                {
                    $unwind: {
                        path: '$students',
                        preserveNullAndEmptyArrays: true, // Student bo'lmasa ham guruhni saqlash
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        name: { $first: '$name' },
                        degree: { $first: '$degree' },
                        studentCount: {
                            $sum: {
                                $cond: [
                                    { $and: ['$students', { $eq: ['$students.role', 'student'] }] },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        degree: 1,
                        studentCount: 1,
                    },
                },
            ]);
            res.status(200).json(groups);
        } else {
            if(req.user.role = 'teacher'){
                const choosenGroupIds = await User.find({_id: teacherId, role: 'teacher'}).select('group_ids');
                const groups2 = await Group.aggregate([
                    {
                        $match: {
                            _id: { $in: choosenGroupIds[0].group_ids }, // Faqat belgilangan ID dagi guruhlar
                        },
                    },
                    {
                        $lookup: {
                            from: 'users', // User kolleksiyasi nomi
                            localField: '_id', // Group modeli `_id` maydoni
                            foreignField: 'group_ids', // User modeli `group_ids` maydoni
                            as: 'students', // Ulangan foydalanuvchilar saqlanadi
                        },
                    },
                    {
                        $unwind: {
                            path: '$students',
                            preserveNullAndEmptyArrays: true, // Student bo'lmasa ham guruhni saqlash
                        },
                    },
                    {
                        $group: {
                            _id: '$_id',
                            name: { $first: '$name' },
                            degree: { $first: '$degree' },
                            studentCount: {
                                $sum: {
                                    $cond: [
                                        { $and: ['$students', { $eq: ['$students.role', 'student'] }] },
                                        1,
                                        0,
                                    ],
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            degree: 1,
                            studentCount: 1,
                        },
                    },
                ]);
                res.status(200).send(groups2);
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get("/group/:id", verifyAdminOrTeacher, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        res.send(group);
    } catch (error) {
        res.send(error);
    }
})

router.post('/group', verifyAdminOrTeacher, checkSchema(groupValidation), async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) return res.status(422).send(err);
        
        const data = matchedData(req);
        
        const newId = await generateSequence('group');
        const newData = {
            _id: newId,
            ...data
        }        
        const group = new Group(newData);
        await group.save();
        console.log(group);
        res.send("Group created successfully");
    } catch (error) {
        res.send(error);
    }
})

router.put('/group/:id', verifyAdminOrTeacher, checkSchema(groupValidation), async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) return res.status(422).send(err);
        
        const data = matchedData(req);
        const newData = {
            ...data
        }
        const group = await Group.findByIdAndUpdate(req.params.id, newData, { new: true });
        res.send(group);
    } catch (error) {
        res.send(error);
    }
})

router.delete('/group/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        const group = await Group.findByIdAndDelete(req.params.id);
        res.send("Data deleted successfully");
    } catch (error) {
        res.send(error);
    }
})

export default router;   
import { Group } from "../mongoose/schemas/group.js";
import { Result } from "../mongoose/schemas/result.js"
import { User } from "../mongoose/schemas/user.js"
import { Progress } from "../mongoose/schemas/progress.js"
import { Router } from "express";
import { Lesson } from "../mongoose/schemas/lesson.js"

const router = Router();

router.get('/statistics', async (req, res) => {
    try {
        const teachers = await User.countDocuments({ role: 'teacher' });
        const studentsCount = await User.countDocuments({ role: 'student' });
        const results = await Result.countDocuments();
        const groups = await Group.countDocuments();

        const students = await User.find({ role: 'student' });
        const studentProgress = await Progress.aggregate([
            {
                $match: {
                    userId: { $in: students.map(student => student._id) },
                    isCompleted: true
                }
            },
            {
                $group: {
                    _id: '$userId',
                    completedLessons: { $sum: 1 }
                }
            }
        ]).sort({ completedLessons: -1 });

        const totalLessons = await Lesson.countDocuments();

        // Promise.all bilan barcha requestlarni parallel bajarish
        const studentsWithProgressPercentage = await Promise.all(
            studentProgress.map(async (progress) => {
                const student = students.find(student => student._id.toString() === progress._id.toString());
                const completedLessons = progress.completedLessons;
                const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
                const groupId = student?.group_ids ? student.group_ids[0] : null;
                const group = groupId ? await Group.findById(groupId) : null;
                const groupName = group ? group.name : null;

                return {
                    id: student._id,
                    first_name: student.first_name,
                    last_name: student.last_name,
                    group_name: groupName,
                    progressPercentage
                };
            })
        );

        res.send({
            teachers,
            students: studentsCount,
            results,
            groups,
            studentsWithProgressPercentage
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

export default router;

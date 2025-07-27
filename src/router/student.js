import { Router } from "express"
import { checkSchema, validationResult, matchedData } from "express-validator";
import { userValidation } from "../utils/validation.js";
import { User } from "../mongoose/schemas/user.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { hashPassword } from "../utils/hashPassword.js";   
import {verifyAdminOrTeacher} from "../utils/verifyAdminOrTeacher.js";
import { Group } from "../mongoose/schemas/group.js"; 

const router = Router();

router.get("/groups", verifyAdminOrTeacher, async (req, res) => {
    try {
      // Barcha guruhlarni topish
      const groups = await Group.find();
  
      // Har bir guruh uchun o'qituvchi va talaba ma'lumotlarini to'plash
      const groupDetails = await Promise.all(
        groups.map(async (group) => {
          const users = await User.find({ group_ids: group._id });
  
          // O'qituvchilar va talabalar sonini aniqlash
          const teachers = users.filter((user) => user.role === "teacher");
          const students = users.filter((user) => user.role === "student");
  
          // Har bir guruh uchun natijalarni shakllantirish
          return {
            ...group._doc,
            teacherCount: teachers.length,
            studentCount: students.length,
            teachers: teachers.map((teacher) => ({
              id: teacher._id,
              first_name: teacher.first_name,
              last_name: teacher.last_name,
            })),
          };
        })
      );
  
      // Natijalarni qaytarish
      res.json(groupDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
});

router.get("/students/by-group/:id", verifyAdminOrTeacher,  async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const students = await User.find({ group_ids: req.params.id, role: "student" });
        res.json({
            ...group._doc,
            studentCount: students.length,
            students: students.map(student => ({
                id: student._id,
                first_name: student.first_name,
                last_name: student.last_name,
                login: student.login,
                phone: student.phone,
                telegram_id: student.telegram_id
            })),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
  

// router.get("/groupsss/:id", async (req, res) => {
//     try {
//       const { id } = req.params;
  
//       const group = await Group.findById(id);
//       if (!group) {
//         return res.status(404).json({ message: "Group not found" });
//       }
  
//       const users = await User.find({ group_ids: id });
  
//       const teachers = users.filter(user => user.role === "teacher");
//       const students = users.filter(user => user.role === "student");
  
//       res.json({
//         ...group._doc,
//         teacherCount: teachers.length,
//         studentCount: students.length,
//         teachers: teachers.map(teacher => ({
//           id: teacher._id,
//           first_name: teacher.first_name,
//           last_name: teacher.last_name,
//         })),
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Server error" });
//     }
// });

router.get('/student', verifyAdminOrTeacher, async (req, res) => {
    try {
        const data = (await User.find()).filter(user => user.role === 'student');
        res.send(data);
    } catch (error) {
        res.send(error);
    }
})

router.get('/student/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        const dataId = req.params.id;
        const findUser = await User.findOne({_id: dataId, role: 'student'});
        const data = {
            _id: findUser._id,
            first_name: findUser.first_name,
            last_name: findUser.last_name,
            login: findUser.login,
            phone: findUser.phone,
            group_ids: findUser.group_ids,
            telegram_id: findUser.telegram_id
        }
        res.send(data);
    } catch (error) {
        
    }
})



router.post('/student', verifyAdminOrTeacher, checkSchema(userValidation), async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(422).send(err);
        }
        const data = matchedData(req);
        const user = await User.findOne({login: data.login});
        if(user) return res.status(400).send({message: `Bunday foydalanuvchi mavjud - ${user.login}`});
        
        data.password = await hashPassword(data.password);
        const newId = await generateSequence('user');
        const newData = {
            _id: newId,
            ...data
        }
        const student = new User(newData);
        await student.save();
        res.send(student);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.put('/student/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, login, phone, telegram_id, group_ids } = req.body;

        const user = await User.findOne({login: login});
        if(user){
            if(user._id != id) return res.status(400).send({message: `Bunday foydalanuvchi mavjud - ${user.login}`});
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { first_name, last_name, login, phone, telegram_id, group_ids }, 
            { new: true, runValidators: true } 
        );
        res.send({ message: "Data updated successfully"});
    } catch (error) {
        res.send(error);
    }
})

router.delete('/student/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        const student = await User.findByIdAndDelete({ _id: req.params.id, role: 'student' });
        res.send("Data deleted successfully");
    } catch (error) {
        res.send(error);
    }
})

export default router
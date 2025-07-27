import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { paymentValidation } from "../utils/validation.js";
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";
import { Payment } from "../mongoose/schemas/payment.js";
import { User } from "../mongoose/schemas/user.js";
import { generateSequence } from "../utils/sequenceGenerator.js";

const router = Router();

// group_id, oy bo'yicha olish
router.post('/payment/group',  async (req, res) => {
    const { group_id, month } = req.body;
    try {
        const students = await User.find({ role: 'student', group_ids: { $in: [group_id] } }); 
        if(students == '') {
            return res.status(404).json({ error: 'Guruh mavjud emas' });
        }

        const paymentRecords = await Promise.all(students.map(async (student) => {
            // Tanlangan sanada mavjud yozuvni qidirish
            let payment = await Payment.findOne({ 
                month: { $gte: new Date(month + "-01"), $lt: new Date(month + "-01").setMonth(new Date(month + "-01").getMonth() + 1) },
                group_id: group_id ,
                student_id: student._id
            });

            

            if (!payment) {
                payment = { 
                    status: false, 
                    amount: 0,
                    month: month,
                    payment_type: "Nomalum",
                    student_id: student._id, 
                    group_id: parseInt(group_id)
                };
            }

            return {
                student_id: student._id,
                first_name: student.first_name,
                last_name: student.last_name,
                payment
            };
        }));

        res.status(200).json(paymentRecords);
    } catch (error) {
        res.status(500).json({ error: 'To\'lov ma\'lumotlarini olishda xatolik yuz berdi.' });
    }
});



router.post('/payment/create', verifyAdminOrTeacher,  checkSchema(paymentValidation), async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(422).send(err);
        }
        const { body } = req;
        const ispayed = await Payment.findOne({student_id: body.student_id, month: body.month + "-01T00:00:00.000Z"});
        if(ispayed) return res.status(400).send({message: "To'lov mavjud"});

        const newId = await generateSequence('payment');
        const newData = {
            _id: newId,
            ...body
        }
        
        const payment = new Payment(newData);
        await payment.save();
        res.status(200).send({"message": "To'lov amalga oshirildi"});
    } catch (error) {
        res.status(500).send(error);
    }
})

// delete all
// router.delete('/payment/delete', async (req, res) => {
//     try {
//         const data = await Payment.deleteMany();
//         res.status(200).send({message: "To'lovlar muvaffaqqiyatli o'chirildi"});
//     } catch (error) {
//         res.status(500).send("malumot o'chmadi")
                
//     }
// })

export default router

const db = {
    status: true,
    amount: 250000,
    month: "11.2024",
    payment_type: "Payme",
    student_id: 5,
    group_id: 1
}

import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { groupValidation } from "../utils/validation.js";
import { Order } from "../mongoose/schemas/order.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";

const router = Router();

router.get('/order-video', verifyAdminOrTeacher, async (req, res) => {
    const data = await Order.find({type: "video"});
    res.send(data);
})

router.get('/order-lesson', verifyAdminOrTeacher, async (req, res) => {
    const data = await Order.find({type: "lesson"});
    res.send(data);
})

router.post('/order', verifyAdminOrTeacher, async (req, res) => {
    try {
        const newId = await generateSequence('order');
        const newData = {
            _id: newId,
            ...req.body
        }
        const order = new Order(newData);
        await order.save();
        res.send({message: "Arizangiz qabul qilindi"});
    } catch (error) {
        res.send({message: "Arizani yuborishda xatolik yuz beri"});
    }
});

router.delete('/order/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        await Order.deleteOne({ _id: req.params.id });
        res.send({message: "Ariza o'chirildi"});
    } catch (error) {
        res.send({message: "Ariza o'chirilmadi"});
    }
});



export default router;   
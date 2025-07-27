import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { userValidation } from "../utils/validation.js";
import { User } from "../mongoose/schemas/user.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { hashPassword } from "../utils/hashPassword.js";  
import { verifyAdmin } from "../utils/verifyAdmin.js";

const router = Router();

router.get('/teacher', verifyAdmin, async (req, res) => {
    try {
        const data = (await User.find()).filter(user => user.role === 'teacher');
        res.send(data);
    } catch (error) {
        res.send(error);
    }
})

router.get('/teacher/:id', verifyAdmin, async (req, res) => {
    try {
        const dataId = req.params.id;
        const findUser = await User.findOne({_id: dataId, role: 'teacher'});
        const data = {
            _id: findUser._id,
            first_name: findUser.first_name,
            last_name: findUser.last_name,
            login: findUser.login,
            phone: findUser.phone,
            group_ids: findUser.group_ids
        }
        res.send(data);
    } catch (error) {
        
    }
})



router.post('/teacher', verifyAdmin, checkSchema(userValidation), async (req, res) => {
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
        const teacher = new User(newData);
        await teacher.save();
        res.send(teacher);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.put('/teacher/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, login, phone, group_ids } = req.body;
        const user = await User.findOne({login: login});
        if(user){
            if(user._id != id) return res.status(400).send({message: `Bunday foydalanuvchi mavjud - ${user.login}`});
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { first_name, last_name, login, phone, group_ids }, 
            { new: true, runValidators: true } 
        );
        res.send({ message: "Data updated successfully"});
    } catch (error) {
        res.send(error);
    }
})

router.delete('/teacher/:id', verifyAdmin, async (req, res) => {
    try {
        const teacher = await User.findByIdAndDelete({ _id: req.params.id, role: 'teacher' });
        res.send("Data deleted successfully");
    } catch (error) {
        res.send(error);
    }
})

export default router
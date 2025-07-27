import { Router } from "express"
import { checkSchema, validationResult, matchedData } from "express-validator";
import { userValidation } from "../utils/validation.js";
import { User } from "../mongoose/schemas/user.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { hashPassword } from "../utils/hashPassword.js";   
import {verifyAdmin} from "../utils/verifyAdmin.js"; 

const router = Router();


router.get('/admin', verifyAdmin, async (req, res) => {
    try {
        const data = (await User.find()).filter(user => user.role === 'admin');
        res.send(data);
    } catch (error) {
        res.send(error);
    }
})

router.get('/admin/:id', verifyAdmin, async (req, res) => {
    try {
        const dataId = req.params.id;
        const findUser = await User.findOne({_id: dataId, role: 'admin'});
        const data = {
            _id: findUser._id,
            first_name: findUser.first_name,
            last_name: findUser.last_name,
            login: findUser.login,
            phone: findUser.phone,
            telegram_id: findUser.telegram_id
        }
        res.send(data);
    } catch (error) {
        
    }
})



router.post('/admin', verifyAdmin, checkSchema(userValidation), async (req, res) => {
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
        const admin = new User(newData);
        await admin.save();
        res.send(admin);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.put('/admin/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, login, phone, telegram_id } = req.body;

        const user = await User.findOne({login: login});
        if(user){
            if(user._id != id) return res.status(400).send({message: `Bunday foydalanuvchi mavjud - ${user.login}`});
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { first_name, last_name, login, phone, telegram_id }, 
            { new: true, runValidators: true } 
        );
        res.send({ message: "Data updated successfully"});
    } catch (error) {
        res.send(error);
    }
})

router.delete('/admin/:id', verifyAdmin, async (req, res) => {
    try {
        const admin = await User.findById({ _id: req.params.id, role: 'admin' });
        if(admin.login  === 'admin') return res.status(400).send("You can't delete admin");
        await admin.deleteOne();
        res.send("Data deleted successfully");
    } catch (error) {
        res.send(error);
    }
})

export default router
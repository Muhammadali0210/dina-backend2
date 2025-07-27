import { Router } from "express";
import { validationResult, matchedData } from "express-validator";
import { Result } from "../mongoose/schemas/result.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";


const router = Router();

router.get('/result', async (req, res) => {
    try {
        const data = await Result.find(); 
        res.send(data);
    } catch (error) {
        res.send(error);
    }
})

router.post('/result', verifyAdminOrTeacher, async (req, res) => {
    try {
        const data = matchedData(req);
        const newId = await generateSequence('result');
        const newData = {
            _id: newId,
            ...req.body
        }
        const result = new Result(newData);
        await result.save();
        const results = await Result.find();
        res.send(results);
    } catch (error) {   
        res.send(error);
    }
})

router.delete('/result/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        await Result.findByIdAndDelete(req.params.id);
        const results = await Result.find();
        res.send(results);
    } catch (error) {
        res.send(error);
    }
})

export default router;
import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { groupValidation } from "../utils/validation.js";
import { News } from "../mongoose/schemas/news.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";

const router = Router();

router.get('/news', async (req, res) => {
    try {
        const data = await News.find();
        res.send(data);
    } catch (error) {
        res.send(error)
    }
})

router.get('/news/last', async (req, res) => {
    try {
        const data = await News.find().sort({ createdAt: -1 }).limit(4);
        res.send(data);
    } catch (error) {
        res.send(error);
    }
})

router.get('/news/:id', async (req, res) => {   
    try {
        const data = await News.findById(req.params.id);
        res.send(data);
    } catch (error) {
        res.send(error);
    }   
})

router.post('/news', verifyAdminOrTeacher, async (req, res) => {
    try {
        const data = matchedData(req);
        const newId = await generateSequence('news');
        const newData = {
            _id: newId,
            ...data
        }
        const news = new News(newData);
        await news.save();
        res.send(news);
    } catch (error) {
        res.send(error);
    }
})

router.put('/news/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image } = req.body;
        const newData = {
            title,
            description,
            image,
        }
        await News.findByIdAndUpdate(id, newData, { new: true });
        res.send(newData);
    } catch (error) {
        res.send(error);
    }
})

router.delete('/news/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        await News.findByIdAndDelete(req.params.id);
        res.send('deleted');
    } catch (error) {
        res.send(error);
    }
})

export default router; 
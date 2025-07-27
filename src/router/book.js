import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { bookValidation } from "../utils/validation.js";
import { Book } from "../mongoose/schemas/book.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";


const router = Router();

router.get('/book', async (req, res) => {
    try {
        const data = await Book.find(); 
        res.send(data);
    } catch (error) {
        res.send(error);
    }
})

router.post('/book', checkSchema(bookValidation), async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(422).send(err);
        }
        const data = matchedData(req);
        const newId = await generateSequence('book');
        const newData = {
            _id: newId,
            ...data
        }
        const book = new Book(newData);
        await book.save();
        res.send(book);
    } catch (error) {   
        res.send(error);
    }
})

router.put('/book/:id', checkSchema(bookValidation), async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(422).send(err);
        }
        const data = matchedData(req);
        const newData = {
            ...data
        }
        const book = await Book.findByIdAndUpdate(req.params.id, newData, { new: true });
        res.send(book);
    } catch (error) {
        res.send(error);
    }
})

router.delete('/book/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        res.send("Data deleted successfully");
    } catch (error) {
        res.send(error);
    }
})

export default router;
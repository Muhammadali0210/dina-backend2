import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { loginValidation } from "../utils/validation.js";
import { User } from "../mongoose/schemas/user.js";
import { Group } from "../mongoose/schemas/group.js";
import { comparePassword } from "../utils/hashPassword.js";
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = 'isThereAnotherOne';

router.post('/auth/login', checkSchema(loginValidation), async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(422).send(err);
        }
        const data = matchedData(req);
        const user = await User.findOne({login: data.login});
        if (!user) return res.status(404).send({message: "Bunday foydalanuvchi topilmadi"});

        if (!await comparePassword(data.password, user.password)) return res.status(401).send({message: "Parol noto'g'ri"});
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);

        // res.send({token: token, role: user.role, data: { first_name: user.first_name, last_name: user.last_name, login: user.login, phone: user.phone, telegram_id: user.telegram_id, group_name: groupName || null } });
        res.send({token: token, role: user.role, id: user._id});
    } catch (error) {
        res.send(error);
    }
})

export default router
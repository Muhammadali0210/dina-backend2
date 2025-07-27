import { Router } from "express";
import auth from './auth.js'
import student from './student.js'
import teacher from './teacher.js'
import group from './group.js'
import payment from './payment.js'
import attendance from './attendance.js'
import book from './book.js';
import admin from './admin.js';
import profile from "./profile.js"
import imagekit from './image-kit.js'
import course from './course.js';
import section from './section.js'
import lesson from './lesson.js'
import result from './result.js'
import order from './order.js'
import news from './news.js'
import dashboard from './dashboard.js'

const router = Router()

router.use(auth)
router.use(student)
router.use(teacher)
router.use(group);
router.use(payment)
router.use(attendance)
router.use(book);
router.use(admin);
router.use(profile);
router.use(imagekit);
router.use(course);
router.use(section);
router.use(lesson);
router.use(result);
router.use(order);
router.use(news);
router.use(dashboard);


export default router;
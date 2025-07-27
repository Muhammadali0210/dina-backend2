import { Router } from "express";
import { Course } from "../mongoose/schemas/course.js";
import { Lesson } from "../mongoose/schemas/lesson.js";
import { Progress } from "../mongoose/schemas/progress.js";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";
import { verifyToken } from "../utils/verifyToken.js";
import { generateSequence } from "../utils/sequenceGenerator.js";
import { Section } from '../mongoose/schemas/section.js'
import { model } from "mongoose";
import { populate } from "dotenv";
import {calculateTotalDuration} from '../utils/colculate-duration.js'

const router = Router();

router.get('/course', verifyAdminOrTeacher, async (req, res) => {
  try {
    const data = await Course.find();
    res.send(data);
  } catch (error) {
    res.send(error);
  }
})


// studentlar uchyun faqat publish bo'lgan kurslarni yuborish
router.get('/online-courses', async (req, res) => {
  try {
    const data = await Course.find({ published: true });
    if (data.length > 0) {
      res.send(data);
    } else {
      res.send({ message: "Online kurslar mavjud emas" });
    }
  } catch (error) {
    res.send(error);
  }
})

export async function getCourseDashboardData(courseId, userId) {
  try {
    const course = await Course.findById(courseId);
    const sections = await Section.find({ courseId })
      .select('title')
      .sort({ position: 1 })
      .populate({
        path: 'lessonId',
        model: Lesson,
        select: 'title userProgress',
        options: { sort: { position: 1 } },
        populate: {
          path: 'userProgress',
          match: { userId },
          model: Progress,
          select: 'lessonId',
        },
      });

    const lessons = sections.map(section => section.lessonId).flat();
    const lessonIds = lessons.map(lesson => lesson._id);

    const validCompletedLessons = await Progress.find({
      userId,
      lessonId: { $in: lessonIds },
      isCompleted: true,
    });

    const progressPercentage =
      lessons.length > 0
        ? (validCompletedLessons.length / lessons.length) * 100
        : 0;

    return { course, sections, progressPercentage };
  } catch (error) {
    throw error;
  }
}


router.get('/dashboard-course/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const data = await getCourseDashboardData(id, userId);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while fetching data.' });
  }
});

router.get('/course/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    const sections = await Section.find({ courseId: req.params.id }).populate({
      path: 'lessonId',
      model: Lesson,
      select: 'title duration',
    });
    
    const totalLessons = sections
    .map(section => section.lessonId)
    .flat()
    
    const data = {
      ...course._doc,
      totalLessons: totalLessons.length,
      totalSections: sections.length,
      totalDuration: calculateTotalDuration(totalLessons),
      purchased: false,
      sections: sections,
    }

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: "Kursni topishda hatolik yuz berdi" });
  }
})

router.post('/course/create', verifyAdminOrTeacher, async (req, res) => {
  try {
    const newData = {
      _id: await generateSequence('course'),
      ...req.body
    }

    const course = new Course(newData);
    const newCourse = await course.save();
    res.status(201).send({ message: "Kurs muvaffaqqiyatli yaratildi" });
  } catch (error) {
    console.log(error);

    res.status(500).send({ message: "Kurs yaratishda hatolik yuz berdi" });
  }
})

router.put('/course/:id', verifyAdminOrTeacher, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send({ message: "Kurs muvaffaqqiyatli o'zgartirildi" });
  } catch (error) {
    res.status(500).send({ message: "Kursni o'zgartirishda hatolik yuz berdi" });
  }
})

// patch
router.patch('/course/:id', verifyAdminOrTeacher, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedUpdates = ['title', 'description', 'learning', 'requirements', 'level', 'language', 'category', 'oldPrice', 'currentPrice', 'previewImage', 'published'];
    const updateKeys = Object.keys(updates);
    const isValidOperation = updateKeys.every((key) => allowedUpdates.includes(key));

    if (!isValidOperation) {
      return res.status(400).send({ message: 'Invalid update operation' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse) {
      return res.status(404).send({ message: 'Course not found!' });
    }

    res.status(200).send(updatedCourse);
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
});

// delete
router.delete('/course/:id', verifyAdminOrTeacher, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    res.send("Data deleted successfully");
  } catch (error) {
    res.send(error);
  }
})

export default router;
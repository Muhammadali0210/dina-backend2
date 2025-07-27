import ImageKit from "imagekit";
import { Router } from "express";
import multer from "multer";
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

const imagekit = new ImageKit({
  publicKey: "public_xyn9SKy/R0uODN6qsmni/yvenv4=",
  privateKey: "private_1M+YLEWx7XOcLnDCc47dupEHwTQ=",
  urlEndpoint: "https://ik.imagekit.io/njtthrpue",
});

router.get("/imagekit-auth", verifyAdminOrTeacher, async (req, res) => {
  const authenticationParameters = await imagekit.getAuthenticationParameters();
  res.json(authenticationParameters);
});

router.post(
  "/upload/videoimg",
  verifyAdminOrTeacher,
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "Fayl taqdim etilmagan." });
      }

      const response = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname
      });

      const transformedUrl = imagekit.url({
        path: response.filePath,
        transformation: [
            { width: 600, height: 360, quality: 90, format: "webp", progressive: true },
        ],
      });
      console.log(transformedUrl);
      

      res.json({url: transformedUrl});
    } catch (error) {
      console.error("Rasm yuklashda xato:", error);
      res.status(500).json({ error: "Rasm yuklashda xato yuz berdi." });
    }
  }
);


router.post(
    "/upload/profileimg",
    upload.single("file"),
    async (req, res) => {
        try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "Fayl taqdim etilmagan." });
        }

        const response = await imagekit.upload({
            file: file.buffer,
            fileName: file.originalname
        });

        const transformedUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: 300, height: 300, quality: 80, format: "webp", progressive: true },
            ],
        });

        res.status(200).send({ url: transformedUrl });
        } catch (error) {
        console.error("Rasm yuklashda xato:", error);
        res.status(500).json({ error: "Rasm yuklashda xato yuz berdi." });
        }
    }
);


export default router;

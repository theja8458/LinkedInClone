import { Router } from "express";
import { runningCheck  , createPost , getAllPosts , deletePost,commentPost , get_comments_by_post , delete_comment_of_user , increment_likes} from "../controllers/posts.controller.js";
import multer from "multer";
const router = Router();
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { cloudinary, storage } from "../cloudConfig.js";

// const storage = multer.diskStorage({
//   destination: (req,file,cb)=>{
//     cb(null , "uploads");
//   },
//   filename:(req,file,cb)=>{
//     cb(null , file.originalname);
//   }
// });
 
import fs from "fs";

const upload = multer({storage});

router.route("/").get(runningCheck);



// router.post("/test-upload", async (req, res) => {
//   try {
//      const imagePath = path.join(__dirname, "..", "uploads", "default.jpg");

//     if (!fs.existsSync(imagePath)) {
//       console.error("❌ File not found:", imagePath);
//       return res.status(404).json({ message: "File not found" });
//     }

//     const result = await cloudinary.uploader.upload(imagePath, {
//       folder: "proconnect_dev"
//     });

//     console.log("✅ Cloudinary Upload Result:", result);
//     res.json(result); // return full result
//   } catch (err) {
//     console.error("❌ Cloudinary Manual Upload Failed:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

router.route("/post").post((req, res, next) => {
  upload.single("media")(req, res, function (err) {
    if (err) {
      console.error("🛑 Multer/Cloudinary error:", err);
      return res.status(500).json({ message: "Upload failed", error: err.message });
    }
    next();
  });
}, createPost);



router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").get(get_comments_by_post);
router.route("/delete_comment").delete(delete_comment_of_user);
router.route("/increment_post_like").post(increment_likes);
export default router;

router.route("/cloudinary-env").get((req, res) => {
  res.json({
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
  });
});
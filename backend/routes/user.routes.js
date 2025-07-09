import { Router } from "express";
import { register,login,uploadProfilePicture } from "../controllers/user.controller.js";
import multer from "multer";
// import { file } from "pdfkit";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file , cb)=>{
        cb(null , "uploads")
    },
    filename: (req,file,cb)=>{
        cb(null , file.originalname);
    }
});

const upload = multer({storage : storage});

router.route("/update_profile_picture")
.post(upload.single("profile_picture") , uploadProfilePicture);

router.route("/register").post(register);
router.route("/login").post(login);
export default router;
import { Router } from "express";
import { register,login,  updateUserProfile, updateProfileData,getUserAndProfile , getAllUserProfiles,downloadProfile , sentRequestConnection , getMyConnectionsRequest , whatAreMyConnections , acceptConnectionRequest, getUserProfileAndUserBasesOnUsername, updateProfilePicture} from "../controllers/user.controller.js";
import multer from "multer";
// import { file } from "pdfkit";
import { cloudinary, storage } from "../cloudConfig.js";

const router = Router();

// const storage = multer.diskStorage({
//     destination: (req, file , cb)=>{
//         cb(null , "uploads")
//     },
//     filename: (req,file,cb)=>{
//         cb(null , file.originalname);
//     }
// });

const upload = multer({storage});
// console.log("🚀 Cloudinary Storage Middleware:", storage);


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(upload.single("profile_picture"), updateProfileData);
router.route("/update_profile_picture").post(upload.single("profile_picture"), updateProfilePicture);
router.route("/user/get_all_user_profiles").get(getAllUserProfiles);
router.route("/user/download_resume").get(downloadProfile);
router.route("/user/send_connection_request").post(sentRequestConnection);
router.route("/user/getConnectionRequests").get(getMyConnectionsRequest);
router.route("/user/user_connection_requests").get(whatAreMyConnections);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);
router.route("/user/get_profile_based_on_username").get(getUserProfileAndUserBasesOnUsername)
export default router;

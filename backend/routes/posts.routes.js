import { Router } from "express";
import { runningCheck } from "../controllers/posts.controller.js";

const router = Router();


router.route("/").get(runningCheck);

export default router;
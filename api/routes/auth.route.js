import express from "express";
import { signup } from "../controller.js/auth.controller.js";
const router = express.Router();

router.post("/signup", signup);
export default router;

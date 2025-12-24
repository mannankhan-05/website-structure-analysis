import express from "express";
const router = express.Router();
import { analyzeWebsite } from "../controllers/analyzeController.js";

router.post("/analyze", analyzeWebsite);

export default router;

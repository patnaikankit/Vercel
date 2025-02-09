import express from "express";
import { serveFiles } from "../controllers/request-handler.controller";

const router = express.Router();

router.get("/serve", serveFiles);

export default router;

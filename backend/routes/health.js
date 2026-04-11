import express from "express"

import { getHealth, getDatabaseHealth } from "../controllers/health.controller";

const router = express.Router();

router.get("/", getHealth);

router.get("/db", getDatabaseHealth);

export default router;
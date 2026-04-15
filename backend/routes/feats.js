import express from "express"

import { validateFeatFields, featExist } from "../middleware/feats.middleware.js";
import { addFeat, deleteFeat, getFeatById, getFeats, updateFeat } from "../controllers/feats.controller.js";

const router = express.Router();

router.get("/", getFeats);

router.get("/:id", featExist, getFeatById);

router.post("/", validateFeatFields, addFeat);

router.put("/:id", featExist, validateFeatFields, updateFeat);

router.delete("/:id", featExist, deleteFeat);

export default router;
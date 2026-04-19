import express from "express"

import { validateFeatFields, featExist, featSlugExist } from "../middleware/feats.middleware.js";
import { addFeat, deleteFeat, getFeatById, getFeatBySlug, getFeats, updateFeat } from "../controllers/feats.controller.js";

const router = express.Router();

router.get("/", getFeats);

router.get("/slug/:slug", featSlugExist, getFeatBySlug);

router.get("/:id", featExist, getFeatById);

router.post("/", validateFeatFields, addFeat);

router.put("/:id", featExist, validateFeatFields, updateFeat);

router.delete("/:id", featExist, deleteFeat);

export default router;

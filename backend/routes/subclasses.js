import express from "express"

import { validateSubclassFields, subclassExist, subclassSlugExist } from "../middleware/subclasses.middleware.js";
import { addSubclass, deleteSubclass, getSubclassById, getSubclassBySlug, getSubclasses, updateSubclass } from "../controllers/subclasses.controller.js";

const router = express.Router();

router.get("/", getSubclasses);

router.get("/slug/:slug", subclassSlugExist, getSubclassBySlug);

router.get("/:id", subclassExist, getSubclassById);

router.post("/", validateSubclassFields, addSubclass);

router.put("/:id", subclassExist, validateSubclassFields, updateSubclass);

router.delete("/:id", subclassExist, deleteSubclass);

export default router;

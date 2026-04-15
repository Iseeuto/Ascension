import express from "express"

import { validateSubclassFields, subclassExist } from "../middleware/subclasses.middleware";
import { addSubclass, deleteSubclass, getSubclassById, getSubclasses, updateSubclass } from "../controllers/subclasses.controller";

const router = express.Router();

router.get("/", getSubclasses);

router.get("/:id", subclassExist, getSubclassById);

router.post("/", validateSubclassFields, addSubclass);

router.put("/:id", subclassExist, validateSubclassFields, updateSubclass);

router.delete("/:id", subclassExist, deleteSubclass);

export default router;
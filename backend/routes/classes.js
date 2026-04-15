import express from "express"
 
import { validateClassFields, classExist } from "../middleware/classes.middleware.js";
import { addClass, deleteClass, getClassById, getClasses, updateClass } from "../controllers/classes.controller.js";
 
const router = express.Router();
 
router.get("/", getClasses);
 
router.get("/:id", classExist, getClassById);
 
router.post("/", validateClassFields, addClass);
 
router.put("/:id", classExist, validateClassFields, updateClass);
 
router.delete("/:id", classExist, deleteClass);
 
export default router;
 
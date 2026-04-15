import express from "express"
 
import { validateClassFields, classExist } from "../middleware/classes.middleware";
import { addClass, deleteClass, getClassById, getClasses, updateClass } from "../controllers/classes.controller";
 
const router = express.Router();
 
router.get("/", getClasses);
 
router.get("/:id", classExist, getClassById);
 
router.post("/", validateClassFields, addClass);
 
router.put("/:id", classExist, validateClassFields, updateClass);
 
router.delete("/:id", classExist, deleteClass);
 
export default router;
 
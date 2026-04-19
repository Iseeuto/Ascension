import express from "express"
 
import { validateRaceFields, raceExist, raceSlugExist } from "../middleware/races.middleware.js";
import { addRace, deleteRace, getRaceById, getRaceBySlug, getRaces, updateRace } from "../controllers/races.controller.js";
 
const router = express.Router();
 
router.get("/", getRaces);

router.get("/slug/:slug", raceSlugExist, getRaceBySlug);
 
router.get("/:id", raceExist, getRaceById);
 
router.post("/", validateRaceFields, addRace);
 
router.put("/:id", raceExist, validateRaceFields, updateRace);
 
router.delete("/:id", raceExist, deleteRace);
 
export default router;
 

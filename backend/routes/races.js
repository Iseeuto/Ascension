import express from "express"
 
import { validateRaceFields, raceExist } from "../middleware/races.middleware";
import { addRace, deleteRace, getRaceById, getRaces, updateRace } from "../controllers/races.controller";
 
const router = express.Router();
 
router.get("/", getRaces);
 
router.get("/:id", raceExist, getRaceById);
 
router.post("/", validateRaceFields, addRace);
 
router.put("/:id", raceExist, validateRaceFields, updateRace);
 
router.delete("/:id", raceExist, deleteRace);
 
export default router;
 
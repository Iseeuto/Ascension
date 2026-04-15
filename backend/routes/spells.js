import express from "express"

import { validateSpellFields, spellExist } from "../middleware/spells.middleware";
import { addSpell, deleteSpell, getSpellById, getSpells, updateSpell } from "../controllers/spells.controller";

const router = express.Router();

router.get("/", getSpells);

router.get("/:id", spellExist, getSpellById);

router.post("/", validateSpellFields, addSpell);

router.put("/:id", spellExist, validateSpellFields, updateSpell);

router.delete("/:id", spellExist, deleteSpell);

export default router;
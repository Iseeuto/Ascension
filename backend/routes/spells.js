import express from "express"

import { validateSpellFields, spellExist, spellSlugExist } from "../middleware/spells.middleware.js";
import { addSpell, deleteSpell, getSpellById, getSpellBySlug, getSpells, updateSpell } from "../controllers/spells.controller.js";

const router = express.Router();

router.get("/", getSpells);

router.get("/slug/:slug", spellSlugExist, getSpellBySlug);

router.get("/:id", spellExist, getSpellById);

router.post("/", validateSpellFields, addSpell);

router.put("/:id", spellExist, validateSpellFields, updateSpell);

router.delete("/:id", spellExist, deleteSpell);

export default router;

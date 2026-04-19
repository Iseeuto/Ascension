import { BuildError, validateFields } from "./utils.js";
import { check } from "express-validator";
import { prisma } from "../lib/prisma.js";

const VALID_LEVELS = ["ASPIRANT", "EVEILLE", "ASCENDANT", "TRANSCENDANT", "SUPREME", "SACRE", "DIVIN"];

const rules = [
    check("slug").notEmpty().isString(),
    check("name").notEmpty().isString(),
    check("description").notEmpty().isString(),
    check("level").notEmpty().isIn(VALID_LEVELS),
];

export async function validateSpellFields(req, res, next) {
    const result = await validateFields(rules, req, res);

    if (result) return result;

    next();
}

export async function spellExist(req, _, next) {
    const { id } = req.params;

    const spell = await prisma.spell.findUnique({
        where: { id }
    });

    if (!spell) throw BuildError(404, "Spell not found.");

    req.spell = spell;

    next();
}

export async function spellSlugExist(req, _, next) {
    const { slug } = req.params;

    const spell = await prisma.spell.findUnique({
        where: { slug }
    });

    if (!spell) throw BuildError(404, "Spell not found.");

    req.spell = spell;

    next();
}

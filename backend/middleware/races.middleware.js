import { BuildError, validateFields } from "./utils.js";
import { check } from "express-validator";
import { prisma } from "../lib/prisma.js";

const rules = [
    check("slug").notEmpty().isString(),
    check("name").notEmpty().isString(),
];

export async function validateRaceFields(req, res, next) {
    const result = await validateFields(rules, req, res);

    if (result) return result;

    next();
}

export async function raceExist(req, _, next) {
    const { id } = req.params;

    const race = await prisma.race.findUnique({
        where: { id }
    });

    if (!race) throw BuildError(404, "Race not found.");

    req.race = race;

    next();
}

export async function raceSlugExist(req, _, next) {
    const { slug } = req.params;

    const race = await prisma.race.findUnique({
        where: { slug }
    });

    if (!race) throw BuildError(404, "Race not found.");

    req.race = race;

    next();
}

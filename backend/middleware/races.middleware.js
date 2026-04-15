import { PrismaClient } from "@prisma/client";
import { BuildError, validateFields } from "./utils";
import { check } from "express-validator";

const prisma = new PrismaClient();

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
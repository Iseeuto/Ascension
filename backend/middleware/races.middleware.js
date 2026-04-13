import { PrismaClient } from "@prisma/client";
import { BuildError } from "./utils";
import { check } from "express-validator";

const prisma = new PrismaClient();

rules = [
    check("slug").isString(),
    check("name").isString(),
]

export async function RaceExist(req, res, next) {
    const { id } = req.params;

    const race = await prisma.race.findUnique({
        where: { id }
    });

    if (!race) throw BuildError(404, "Race not found.");

    req.race = race;

    next();
}


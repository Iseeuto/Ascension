import { BuildError, validateFields } from "./utils.js";
import { check } from "express-validator";
import { prisma } from "../lib/prisma.js";

const rules = [
    check("slug").notEmpty().isString(),
    check("name").notEmpty().isString(),
];

export async function validateFeatFields(req, res, next) {
    const result = await validateFields(rules, req, res);

    if (result) return result;

    next();
}

export async function featExist(req, _, next) {
    const { id } = req.params;

    const feat = await prisma.feat.findUnique({
        where: { id }
    });

    if (!feat) throw BuildError(404, "Feat not found.");

    req.feat = feat;

    next();
}

export async function featSlugExist(req, _, next) {
    const { slug } = req.params;

    const feat = await prisma.feat.findUnique({
        where: { slug }
    });

    if (!feat) throw BuildError(404, "Feat not found.");

    req.feat = feat;

    next();
}

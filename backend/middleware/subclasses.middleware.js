import { PrismaClient } from "@prisma/client";
import { BuildError, validateFields } from "./utils.js";
import { check } from "express-validator";

const prisma = new PrismaClient();

const rules = [
    check("slug").notEmpty().isString(),
    check("name").notEmpty().isString(),
    check("classId").notEmpty().isString(),
    check("table").notEmpty().isObject(),
    check("table.columns").isArray(),
    check("table.rows").isArray(),
];

export async function validateSubclassFields(req, res, next) {
    const result = await validateFields(rules, req, res);

    if (result) return result;

    next();
}

export async function subclassExist(req, _, next) {
    const { id } = req.params;

    const subclass = await prisma.subclass.findUnique({
        where: { id },
        include: { class: true }
    });

    if (!subclass) throw BuildError(404, "Subclass not found.");

    req.subclass = subclass;

    next();
}
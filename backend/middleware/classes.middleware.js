import { PrismaClient } from "@prisma/client";
import { BuildError, validateFields } from "./utils";
import { check } from "express-validator";

const prisma = new PrismaClient();

const rules = [
    check("slug").notEmpty().isString(),
    check("name").notEmpty().isString(),
    check("table").notEmpty().isObject(),
    check("table.columns").isArray(),
    check("table.rows").isArray(),
];

export async function validateClassFields(req, res, next) {
    const result = await validateFields(rules, req, res);

    if (result) return result;

    next();
}

export async function classExist(req, _, next) {
    const { id } = req.params;

    const cls = await prisma.class.findUnique({
        where: { id },
        include: { subclasses: true }
    });

    if (!cls) throw BuildError(404, "Class not found.");

    req.cls = cls;

    next();
}
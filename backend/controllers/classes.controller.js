import { prisma } from "../lib/prisma.js";
import {
    mapClassCatalogueItem,
    mapSubclassCatalogueItem,
} from "./catalogue.controller.js";

export async function getClasses(_, res) {
    const classes = await prisma.class.findMany({
        include: {
            subclasses: {
                select: {
                    id: true,
                }
            },
            sections: true,
        },
        orderBy: {
            name: "asc",
        }
    });

    res.json(classes.map(mapClassCatalogueItem));
}

export async function getClassById(req, res) {
    res.json(req.cls);
}

export async function getClassBySlug(req, res) {
    res.json(req.cls);
}

export async function getClassSubclasses(req, res) {
    const subclasses = await prisma.subclass.findMany({
        where: {
            classId: req.cls.id,
        },
        include: {
            class: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                }
            }
        },
        orderBy: {
            name: "asc",
        }
    });

    res.json(subclasses.map(mapSubclassCatalogueItem));
}

export async function addClass(req, res) {
    const { slug, name, description, table, sections } = req.body;

    const cls = await prisma.class.create({
        data: {
            slug,
            name,
            description,
            table,
            sections
        }
    });

    res.status(201).json(cls);
}

export async function updateClass(req, res) {
    const { id } = req.params;
    const { slug, name, description, table, sections } = req.body;

    const cls = await prisma.class.update({
        where: { id },
        data: {
            slug,
            name,
            description,
            table,
            sections
        }
    });

    res.json(cls);
}

export async function deleteClass(req, res) {
    const { id } = req.params;

    await prisma.class.delete({
        where: { id }
    });

    res.sendStatus(200);
}

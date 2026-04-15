import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export async function getClasses(_, res) {
    const classes = await prisma.class.findMany({
        include: {
            subclasses: false,
        }
    });

    res.json(classes);
}

export async function getClassById(req, res) {
    res.json(req.cls);
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
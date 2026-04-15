import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export async function getSubclasses(req, res) {
    const { classId } = req.query;

    const subclasses = await prisma.subclass.findMany({
        where: classId ? { classId } : undefined,
        include: {
            class: false,
        }
    });

    res.json(subclasses);
}

export async function getSubclassById(req, res) {
    res.json(req.subclass);
}

export async function addSubclass(req, res) {
    const { slug, name, description, classId, table, sections } = req.body;

    const subclass = await prisma.subclass.create({
        data: {
            slug,
            name,
            description,
            classId,
            table,
            sections
        }
    });

    res.status(201).json(subclass);
}

export async function updateSubclass(req, res) {
    const { id } = req.params;
    const { slug, name, description, classId, table, sections } = req.body;

    const subclass = await prisma.subclass.update({
        where: { id },
        data: {
            slug,
            name,
            description,
            classId,
            table,
            sections
        }
    });

    res.json(subclass);
}

export async function deleteSubclass(req, res) {
    const { id } = req.params;

    await prisma.subclass.delete({
        where: { id }
    });

    res.sendStatus(200);
}
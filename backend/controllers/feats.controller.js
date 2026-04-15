import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export async function getFeats(_, res) {
    const feats = await prisma.feat.findMany({
        include: {
            sections: false,
        }
    });

    res.json(feats);
}

export async function getFeatById(req, res) {
    res.json(req.feat);
}

export async function addFeat(req, res) {
    const { slug, name, description, prerequisite, sections } = req.body;

    const feat = await prisma.feat.create({
        data: {
            slug,
            name,
            description,
            prerequisite,
            sections
        }
    });

    res.status(201).json(feat);
}

export async function updateFeat(req, res) {
    const { id } = req.params;
    const { slug, name, description, prerequisite, sections } = req.body;

    const feat = await prisma.feat.update({
        where: { id },
        data: {
            slug,
            name,
            description,
            prerequisite,
            sections
        }
    });

    res.json(feat);
}

export async function deleteFeat(req, res) {
    const { id } = req.params;

    await prisma.feat.delete({
        where: { id }
    });

    res.sendStatus(200);
}
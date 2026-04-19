import { prisma } from "../lib/prisma.js";
import { mapFeatCatalogueItem } from "./catalogue.controller.js";

export async function getFeats(_, res) {
    const feats = await prisma.feat.findMany({
        include: {
            sections: true,
        },
        orderBy: {
            name: "asc",
        }
    });

    res.json(feats.map(mapFeatCatalogueItem));
}

export async function getFeatById(req, res) {
    res.json(req.feat);
}

export async function getFeatBySlug(req, res) {
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

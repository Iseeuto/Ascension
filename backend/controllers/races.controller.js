import { prisma } from "../lib/prisma.js";
import { mapRaceCatalogueItem } from "./catalogue.controller.js";

export async function getRaces(_, res) {
    const races = await prisma.race.findMany({
        include: {
            sections: true,
        },
        orderBy: {
            name: "asc",
        }
    });

    res.json(races.map(mapRaceCatalogueItem));
}

export async function getRaceById(req, res) {
    res.json(req.race);
}

export async function getRaceBySlug(req, res) {
    res.json(req.race);
}

export async function addRace(req, res) {
    const { slug, name, description, sections } = req.body;

    const race = await prisma.race.create({
        data: {
            slug,
            name,
            description,
            sections
        }
    });

    res.status(201).json(race);
}

export async function updateRace(req, res) {
    const { id } = req.params;
    const { slug, name, description, sections } = req.body;

    const race = await prisma.race.update({
        where: { id },
        data: {
            slug,
            name,
            description,
            sections
        }
    });

    res.json(race);
}

export async function deleteRace(req, res) {
    const { id } = req.params;

    await prisma.race.delete({
        where: { id }
    });

    res.sendStatus(200);
}

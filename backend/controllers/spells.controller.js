import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export async function getSpells(req, res) {
    const { level } = req.query;

    const spells = await prisma.spell.findMany({
        where: level ? { level } : undefined,
    });

    res.json(spells);
}

export async function getSpellById(req, res) {
    res.json(req.spell);
}

export async function addSpell(req, res) {
    const { slug, name, description, level } = req.body;

    const spell = await prisma.spell.create({
        data: {
            slug,
            name,
            description,
            level
        }
    });

    res.status(201).json(spell);
}

export async function updateSpell(req, res) {
    const { id } = req.params;
    const { slug, name, description, level } = req.body;

    const spell = await prisma.spell.update({
        where: { id },
        data: {
            slug,
            name,
            description,
            level
        }
    });

    res.json(spell);
}

export async function deleteSpell(req, res) {
    const { id } = req.params;

    await prisma.spell.delete({
        where: { id }
    });

    res.sendStatus(200);
}
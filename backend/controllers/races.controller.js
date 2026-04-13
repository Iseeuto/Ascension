import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export async function getRaces(_, res) {
    const races = await prisma.race.findMany({
        include: {
            sections : false,
            subclasses : false
        }
    });

    res.json(bookings);
}

export async function getRaceById(req, res) {
    res.json(req.race);
}
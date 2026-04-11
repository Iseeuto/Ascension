import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getHealth = async (_, res) => {
    res.json({
    ok: true,
    service: "ascension-back",
    timestamp: new Date().toISOString(),
  });
}

export const getDatabaseHealth = async (_, res) => {
    try {
    await prisma.$runCommandRaw({ ping: 1 });

    res.json({
      ok: true,
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(500).json({
      ok: false,
      database: "disconnected",
      message: "Unable to reach MongoDB with the current DATABASE_URL.",
    });
  }
}
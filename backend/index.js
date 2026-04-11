import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client";

import healthRoutes from "./routes/health.js"

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());


app.use("/api", healthRoutes);


app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);

  res.status(500).json({
    message: "Internal server error.",
  });
});

app.listen(port, () => {
  console.log(`Ascension backend listening on http://localhost:${port}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

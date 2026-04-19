import express from "express";
import cors from "cors";
import "dotenv/config";

import healthRouter from "./routes/health.js"
import racesRouter from "./routes/races.js";
import classesRouter from "./routes/classes.js";
import subclassesRouter from "./routes/subclasses.js";
import featsRouter from "./routes/feats.js";
import spellsRouter from "./routes/spells.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRouter);
app.use("/races", racesRouter);
app.use("/classes", classesRouter);
app.use("/subclasses", subclassesRouter);
app.use("/feats", featsRouter);
app.use("/spells", spellsRouter);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
import express from "express";
 
import racesRouter from "./routes/races.router";
import classesRouter from "./routes/classes.router";
import subclassesRouter from "./routes/subclasses.router";
import featsRouter from "./routes/feats.router";
import spellsRouter from "./routes/spells.router";
 
const app = express();
 
app.use(express.json());
 
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
 
export default app;
 
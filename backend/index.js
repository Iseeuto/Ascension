const express = require("express");
const cors = require("cors");
const { prisma } = require("./src/lib/prisma");

require("dotenv").config();

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "ascension-back",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health/db", async (_req, res) => {
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
});

app.get("/api/articles", async (_req, res) => {
  try {
    const articles = await prisma.article.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.json(articles);
  } catch (error) {
    console.error("Failed to fetch articles:", error);

    res.status(500).json({
      message: "Unable to fetch articles.",
    });
  }
});

app.get("/api/articles/:slug", async (req, res) => {
  try {
    const article = await prisma.article.findUnique({
      where: {
        slug: req.params.slug,
      },
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found.",
      });
    }

    return res.json(article);
  } catch (error) {
    console.error("Failed to fetch article:", error);

    return res.status(500).json({
      message: "Unable to fetch article.",
    });
  }
});

app.post("/api/articles", async (req, res) => {
  const { slug, title, category, excerpt, content, published } = req.body;

  if (!slug || !title || !category || !content) {
    return res.status(400).json({
      message: "slug, title, category and content are required.",
    });
  }

  try {
    const article = await prisma.article.create({
      data: {
        slug,
        title,
        category,
        excerpt: excerpt ?? null,
        content,
        published: published ?? false,
      },
    });

    return res.status(201).json(article);
  } catch (error) {
    console.error("Failed to create article:", error);

    return res.status(500).json({
      message: "Unable to create article.",
    });
  }
});

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

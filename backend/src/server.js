const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const { port, allowedOrigins } = require("./config/env");
const voteRoutes = require("./routes/voteRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const { expireStaleSessions } = require("./services/voteService");

const app = express();

app.use((req, res, next) => {
  if (req.originalUrl === "/webhook/paystack") {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      req.rawBody = data;
      try {
        req.body = data ? JSON.parse(data) : {};
      } catch {
        req.body = {};
      }
      next();
    });
    return;
  }
  next();
});

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    }
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use(voteRoutes);
app.use(webhookRoutes);

cron.schedule("* * * * *", async () => {
  try {
    await expireStaleSessions();
  } catch (_) {
    // keep service alive even if cron query fails
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend running on port ${port}`);
});

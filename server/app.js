const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cron = require("node-cron");
const { autoGenerateNextDaySlotsJob } = require("./cron/slotCron");
const path = require("path");

const { requestLogger, errorLogger } = require("./middleware/loggerMiddleware");
const logger = require("./utils/logger");

dotenv.config();
connectDB();

const app = express();

// Log server start
logger.info("🚀 Server starting...");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Request logging (very early middleware)
app.use(requestLogger);

// Routes
app.use("/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);

// Run cron job every day at 11:55 PM
cron.schedule("55 23 * * *", () => {
  logger.info("🗓️ Running scheduled job: autoGenerateNextDaySlotsJob");
  autoGenerateNextDaySlotsJob();
});

// Serve static assets if in production
app.use(express.static(path.join(__dirname, "dist")));

// Client-side routing fallback
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});

app.get("/", (req, res) => {
  res.send("Welcome to API");
});

// Error logging middleware (should be after routes)
app.use(errorLogger);

// Optional generic error handler if not already implemented
app.use((err, req, res, next) => {
  logger.error("[Unhandled Error]", err);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;

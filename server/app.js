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

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);

// Run cron job every day at 11:55 PM
cron.schedule("55 23 * * *", autoGenerateNextDaySlotsJob);

// Serve static assets if in production

app.use(express.static(path.join(__dirname, "dist")));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});
app.get("/", (req, res) => {
  res.send("Welcome to  APi");
});
module.exports = app;

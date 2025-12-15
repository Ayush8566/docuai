require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();


const passport = require("./config/passport");
app.use(passport.initialize());

const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const docsRoutes = require("./routes/docs");
const githubRoutes = require("./routes/github");
const activityRoutes = require("./routes/activity");
require("./config/passport");
app.use(passport.initialize());
// auth middleware
const { protect } = require("./middleware/auth");


process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("🔥 Unhandled Rejection:", reason);
});


app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);


app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/docs", docsRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/profile", require("./routes/profile"));
app.use("/api/activity", activityRoutes);


app.get("/api/me", protect, (req, res) => {
  res.json({ user: req.user });
});


app.get("/health", (_, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});


const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ Missing MongoDB URI");
  process.exit(1);
}

const PORT = process.env.PORT || 4000;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

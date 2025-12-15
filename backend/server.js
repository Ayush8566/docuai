// // // server.js
// // require("dotenv").config();
// // const express = require("express");
// // const cors = require("cors");
// // const mongoose = require("mongoose");

// // // routes
// // const authRoutes = require("./routes/auth");
// // const uploadRoutes = require("./routes/upload");
// // const docsRoutes = require("./routes/docs");

// // // auth middleware (protect)
// // const { protect } = require("./middleware/auth"); // make sure this file exists

// // const app = express();

// // // CORS - allow frontend origin in .env (FRONTEND_URL) or allow all in dev
// // app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));

// // // body parser
// // app.use(express.json()); // replaces body-parser usage

// // // public routes
// // app.use("/api/auth", authRoutes);
// // app.use("/api/upload", uploadRoutes);
// // app.use("/api/docs", docsRoutes);

// // // protected example route
// // app.get("/api/me", protect, (req, res) => {
// //   // protect middleware attaches req.user
// //   res.json({ user: req.user });
// // });

// // // ensure we have a MongoDB connection string
// // const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
// // if (!MONGO_URI) {
// //   console.error(
// //     "Missing MongoDB connection string. Set MONGODB_URI or MONGO_URI in .env"
// //   );
// //   process.exit(1);
// // }

// // const PORT = process.env.PORT || 4000;

// // mongoose
// //   .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// //   .then(() => {
// //     console.log("MongoDB connected");
// //     app.listen(PORT, () => console.log("Server listening on", PORT));
// //   })
// //   .catch((err) => {
// //     console.error("MongoDB connection error:", err);
// //     process.exit(1);
// //   });

// // backend/server.js
// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const app = express();

// // routes
// const authRoutes = require("./routes/auth");
// const uploadRoutes = require("./routes/upload");
// const docsRoutes = require("./routes/docs");
// const githubRoutes = require("./routes/github");
// // auth middleware
// const { protect } = require("./middleware/auth");

// /* ===================== GLOBAL CRASH GUARDS ===================== */
// // 🔥 VERY IMPORTANT: prevents ERR_CONNECTION_RESET
// process.on("uncaughtException", (err) => {
//   console.error("🔥 Uncaught Exception:", err);
// });

// process.on("unhandledRejection", (reason) => {
//   console.error("🔥 Unhandled Rejection:", reason);
// });

// /* ===================== CORS ===================== */
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "*",
//     credentials: true,
//   })
// );

// /* ===================== BODY PARSERS ===================== */
// // Keep JSON small (uploads use multer, not JSON)
// app.use(express.json({ limit: "5mb" }));
// app.use(express.urlencoded({ extended: true }));

// /* ===================== ROUTES ===================== */
// app.use("/api/auth", authRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/docs", docsRoutes);

// app.use("/api/github", githubRoutes);
// // protected test route
// app.get("/api/me", protect, (req, res) => {
//   res.json({ user: req.user });
// });

// /* ===================== HEALTH CHECK ===================== */
// app.get("/health", (_, res) => {
//   res.json({ status: "ok", uptime: process.uptime() });
// });

// /* ===================== DB + SERVER ===================== */
// const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// if (!MONGO_URI) {
//   console.error(
//     "❌ Missing MongoDB connection string. Set MONGODB_URI or MONGO_URI in .env"
//   );
//   process.exit(1);
// }

// const PORT = process.env.PORT || 4000;

// mongoose
//   .connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 10000, // ⛔ prevent hanging forever
//   })
//   .then(() => {
//     console.log("✅ MongoDB connected");

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   });

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// routes
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

/* ===================== GLOBAL SAFETY ===================== */
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("🔥 Unhandled Rejection:", reason);
});

/* ===================== CORS ===================== */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

/* ===================== BODY PARSERS ===================== */
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

/* ===================== ROUTES ===================== */
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/docs", docsRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/profile", require("./routes/profile"));
app.use("/api/activity", activityRoutes);

// protected route
app.get("/api/me", protect, (req, res) => {
  res.json({ user: req.user });
});

/* ===================== HEALTH CHECK ===================== */
app.get("/health", (_, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

/* ===================== DB + SERVER ===================== */
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

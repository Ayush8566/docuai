import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import dotenv from "dotenv";
dotenv.config();
import listingRouter from "./routes/listing.js";
// Load environment variables
import cookieParser from "cookie-parser";

import path from "path";
const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 9000;

// ...existing code...

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);

    // console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB(); // Only this, remove the separate app.listen below

const __dirname = path.resolve();
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import supplierRoutes from "./routes/supplierRoutes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["https://query-1-c2fy.onrender.com", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

// Connect to MongoDB before starting the server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

// Define Routes
app.use("/api/suppliers", cors(), supplierRoutes);

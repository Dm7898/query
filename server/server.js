import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import supplierRoutes from "./routes/supplierRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

// Connect to MongoDB before starting the server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

// Define Routes
// app.use("/api/auth", authRoutes);
app.use("/api/suppliers", supplierRoutes);

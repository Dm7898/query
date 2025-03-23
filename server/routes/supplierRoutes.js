import express, { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  filters,
  getcategories,
  results,
  uploadFile,
} from "../controllers/supplierController.js";

const router = express.Router();

// Convert ES module paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the "uploads" directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Multer Storage and File Filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".csv", ".xlsx", ".xls"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedTypes.includes(ext)) {
    return cb(new Error("Only CSV, XLSX, and XLS files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

router.post("/upload", upload.single("file"), uploadFile);
router.get("/categories", getcategories);
router.get("/filters", filters);
router.get("/results", results);

export default router;

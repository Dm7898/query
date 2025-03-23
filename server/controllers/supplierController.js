import Supplier from "../models/Supplier.js";
import xlsx from "xlsx";
import fs from "fs";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded!" });
    }

    const filePath = req.file.path; // Read from disk

    // Read Excel file from disk
    const workbook = xlsx.readFile(filePath);

    const sheetName = "Sheet1"; // Explicitly use "Sheet1"
    if (!workbook.Sheets[sheetName]) {
      return res
        .status(400)
        .json({ success: false, message: "Sheet1 not found!" });
    }

    if (!sheetName) {
      return res
        .status(400)
        .json({ success: false, message: "No sheets found in Excel file!" });
    }

    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheetData.length) {
      return res
        .status(400)
        .json({ success: false, message: "Excel file is empty!" });
    }

    // Check for required columns
    const requiredColumns = [
      "CategoryShortName",
      "BranchAlias",
      "SupplierAlias",
    ];
    const fileColumns = Object.keys(sheetData[0]);
    const missingColumns = requiredColumns.filter(
      (col) => !fileColumns.includes(col)
    );

    if (missingColumns.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing columns: ${missingColumns.join(", ")}`,
      });
    }

    // Convert to database format
    const transactions = sheetData.map((row) => ({
      Category: row.CategoryShortName || "Unknown",
      Branch: row.BranchAlias || "Unknown",
      SupplierAlias: row.SupplierAlias || "Unknown",
      Department: row.DepartmentShortName || "Unknown",
      ArticleNumber: row.ArticleNo || "Unknown",
      NetAmount: row.NetAmount || 0,
      NetSlsCostValue: row.NetSlsCostValue || 0,
      NetSlsQty: row.NetSlsQty || 0,
    }));

    // // Check for duplicate data
    // const existingTransactions = await Supplier.find({
    //   Category: transactions[0].Category,
    //   Branch: transactions[0].Branch,
    //   Supplier: transactions[0].Supplier,
    // });

    // if (existingTransactions.length > 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "File already uploaded with this data!",
    //   });
    // }

    // Insert into database
    await Supplier.insertMany(transactions);

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: "File processed and data stored successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error processing file" });
  }
};

export const getcategories = async (req, res) => {
  try {
    const categories = await Supplier.distinct("Category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch branches and suppliers based on category
export const filters = async (req, res) => {
  try {
    let { category } = req.query;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    let query = category === "All" ? {} : { Category: category };

    const branches = await Supplier.distinct("Branch", query);
    const suppliers = await Supplier.distinct("SupplierAlias", query);
    // console.log(branches, suppliers);
    res.json({ branches, suppliers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch aggregated data based on branch and supplier selection
export const results = async (req, res) => {
  try {
    const { branches, suppliers } = req.query;
    // console.log(branches, suppliers);
    if (!branches || !suppliers)
      return res.status(400).json({ error: "Filters are required" });
    console.log("Branches:", branches.split(","));
    console.log("Suppliers:", suppliers.split(","));
    const filter = {
      Branch: { $in: branches.split(",") },
      SupplierAlias: { $in: suppliers.split(",") },
    };

    const results = await Supplier.aggregate([
      { $match: filter },

      // Group by Article
      {
        $group: {
          _id: {
            article: "$ArticleNumber",
            supplier: "$SupplierAlias",
            department: "$Department",
            branch: "$Branch",
          },
          NetAmount: { $sum: "$NetAmount" },
          NetSlsCostValue: { $sum: "$NetSlsCostValue" },
          NetSlsQty: { $sum: "$NetSlsQty" },
        },
      },

      // Group by Supplier (Summing all Articles per Supplier)
      {
        $group: {
          _id: {
            supplier: "$_id.supplier",
            department: "$_id.department",
            branch: "$_id.branch",
          },
          articles: {
            $push: {
              article: "$_id.article",
              NetAmount: "$NetAmount",
              NetSlsCostValue: "$NetSlsCostValue",
              NetSlsQty: "$NetSlsQty",
            },
          },
          totalNetAmount: { $sum: "$NetAmount" },
          totalNetSlsCostValue: { $sum: "$NetSlsCostValue" },
          totalNetSlsQty: { $sum: "$NetSlsQty" },
        },
      },

      // Group by Department (Summing all Suppliers per Department)
      {
        $group: {
          _id: { department: "$_id.department", branch: "$_id.branch" },
          suppliers: {
            $push: {
              supplier: "$_id.supplier",
              totalNetAmount: "$totalNetAmount",
              totalNetSlsCostValue: "$totalNetSlsCostValue",
              totalNetSlsQty: "$totalNetSlsQty",
              articles: "$articles",
            },
          },
          departmentTotalNetAmount: { $sum: "$totalNetAmount" },
          departmentTotalNetSlsCostValue: { $sum: "$totalNetSlsCostValue" },
          departmentTotalNetSlsQty: { $sum: "$totalNetSlsQty" },
        },
      },

      // Group by Branch (Summing all Departments per Branch)
      {
        $group: {
          _id: "$_id.branch",
          departments: {
            $push: {
              department: "$_id.department",
              departmentTotalNetAmount: "$departmentTotalNetAmount",
              departmentTotalNetSlsCostValue: "$departmentTotalNetSlsCostValue",
              departmentTotalNetSlsQty: "$departmentTotalNetSlsQty",
              suppliers: "$suppliers",
            },
          },
          branchTotalNetAmount: { $sum: "$departmentTotalNetAmount" },
          branchTotalNetSlsCostValue: {
            $sum: "$departmentTotalNetSlsCostValue",
          },
          branchTotalNetSlsQty: { $sum: "$departmentTotalNetSlsQty" },
        },
      },

      // Sort branches alphabetically
      { $sort: { _id: 1 } },
    ]);

    console.log(results);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

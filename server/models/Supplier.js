import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  Category: { type: String, index: true },
  Branch: { type: String, index: true },
  Department: { type: String, index: true },
  SupplierAlias: { type: String, index: true },
  ArticleNumber: { type: String, index: true },
  NetAmount: Number,
  NetSlsCostValue: Number,
  NetSlsQty: Number,
});

supplierSchema.index({
  Category: 1,
  Branch: 1,
  SupplierAlias: 1,
  Department: 1,
  ArticleNumber: 1,
});

const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;

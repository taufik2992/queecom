import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/upload.js";
import { authorize, protect } from "../middlewares/auth.js";

const productRouter = express.Router();

//GET all products
productRouter.get("/", getProducts);

//GET single Product
productRouter.get("/:id", getProduct);

//Create Product (admin only)
productRouter.post(
  "/",
  upload.array("images", 5),
  protect,
  authorize("admin"),
  createProduct,
);

//Update Product (Admin Only)
productRouter.put(
  "/:id",
  upload.array("images", 5),
  protect,
  authorize("admin"),
  updateProduct,
);

//Delete Product (Admin Only)
productRouter.post("/:id", protect, authorize("admin"), deleteProduct);

export default productRouter;

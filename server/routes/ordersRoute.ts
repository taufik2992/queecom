import express from "express";
import { authorize, protect } from "../middlewares/auth.js";
import {
  createOrder,
  getAllOrders,
  getOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const OrderRouter = express.Router();

//Get user orders
OrderRouter.get("/", protect, getOrders);

// Get Single Order
OrderRouter.get("/", protect, getOrder);

//create order from cart
OrderRouter.post("/:id", protect, createOrder);

//update order status (admin Only)
OrderRouter.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

//Get all orders (admin Only)
OrderRouter.get("/admin/all", protect, authorize("admin"), getAllOrders);

export default OrderRouter;

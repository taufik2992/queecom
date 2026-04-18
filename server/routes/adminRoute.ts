import express from "express";
import { authorize, protect } from "../middlewares/auth.js";
import { getDashboardStats } from "../controllers/adminController.js";

const AdminRoute = express.Router();

//GET dashboard stats
AdminRoute.get("/stats", protect, authorize("admin"), getDashboardStats);

export default AdminRoute;

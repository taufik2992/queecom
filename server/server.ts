import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhook } from "./controllers/webhooks.js";
import makeAdmin from "./scripts/makeAdmin.js";
import productRouter from "./routes/productsRoute.js";
import CartRouter from "./routes/cartRoute.js";
import OrderRouter from "./routes/ordersRoute.js";
import AddressRouter from "./routes/addressRoute.js";
import AdminRoute from "./routes/adminRoute.js";

const app = express();

//connect to MongoDB
await connectDB();

app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhook);

//middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});
app.use("/api/products", productRouter);
app.use("/api/cart", CartRouter);
app.use("/api/orders", OrderRouter);
app.use("/api/addresses", AddressRouter);
app.use("/api/admin", AdminRoute);

await makeAdmin();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

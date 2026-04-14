import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();

//connect to MongoDB
await connectDB();

app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  (req: Request, res: Response) => {
    console.log("Received request body:", req.body);
    res.status(200).json({ message: "Clerk webhook received" });
  },
);

//middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

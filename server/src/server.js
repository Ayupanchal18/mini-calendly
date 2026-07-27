import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import availabilityRouter from "./routes/AvailablityRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config({ path: path.resolve(__dirname, "../.env") });

connectDB();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/frontend", authRouter);
app.use("/frontend/availability", availabilityRouter);
app.use("/frontend", availabilityRouter); // Also mount at /frontend for direct endpoint access

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
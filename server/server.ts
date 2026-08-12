import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import productRoutes from "./routes/productRoutes";
import userRoutes from './routes/userRoutes';



dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
// THIS IS THE IMPORTANT LINE
app.use("/api/products", productRoutes);

app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


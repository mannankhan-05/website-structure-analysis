import express from "express";
import cors from "cors";
const app = express();

import analyzeRoutes from "./routes/analyzeRoute.js";
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", analyzeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

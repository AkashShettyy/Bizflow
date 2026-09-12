import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./auth/routes.js";
import errorHandler from "./middlewares/error.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "BizFlow API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
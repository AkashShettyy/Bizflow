import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./auth/routes.js";
import customerRoutes from "./customers/routes.js";
import projectRoutes from "./projects/routes.js";
import errorHandler from "./middlewares/error.js";
import taskRoutes from "./tasks/routes.js";
import userRoutes from "./users/routes.js";
import invoiceRoutes from "./invoices/routes.js";

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
app.use("/api/customers", customerRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/invoices", invoiceRoutes);

app.use(errorHandler);

export default app;
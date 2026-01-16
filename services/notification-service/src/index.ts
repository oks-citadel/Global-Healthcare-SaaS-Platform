import express, { Application, RequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config } from "dotenv";
import { notificationRoutes } from "./routes/notification.routes.js";
import { templateRoutes } from "./routes/template.routes.js";
import { preferenceRoutes } from "./routes/preference.routes.js";
import { healthRoutes } from "./routes/health.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { logger } from "./utils/logger.js";

config();

const app: Application = express();
const PORT = process.env.PORT || 3006;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3000"],
    credentials: true,
  }),
);

// Rate limiting
const limiter: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
}) as unknown as RequestHandler;
app.use("/api/", limiter);

// Parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(
  morgan("combined", {
    stream: { write: (message: string) => logger.info(message.trim()) },
  }),
);

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/preferences", preferenceRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Notification Service running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;

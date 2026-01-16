import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { userController } from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { healthController } from "../controllers/health.controller.js";

const router = Router();

// ==========================================
// Health Check Endpoints
// ==========================================
router.get("/health", healthController.health);
router.get("/health/live", healthController.liveness);
router.get("/health/ready", healthController.readiness);

// ==========================================
// Auth Endpoints
// ==========================================
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/refresh", authController.refresh);
router.post("/auth/logout", authenticate, authController.logout);
router.get("/auth/me", authenticate, authController.me);

// Internal endpoint for inter-service token verification
router.post("/auth/verify-token", authController.verifyToken);

// ==========================================
// Roles Endpoint
// ==========================================
router.get("/roles", authenticate, authorize("admin"), authController.getRoles);

// ==========================================
// User Endpoints
// ==========================================
router.get("/users/:id", authenticate, userController.getUser);
router.patch("/users/:id", authenticate, userController.updateUser);
router.get(
  "/users",
  authenticate,
  authorize("admin"),
  userController.listUsers,
);
router.delete(
  "/users/:id",
  authenticate,
  authorize("admin"),
  userController.deleteUser,
);

export { router as routes };

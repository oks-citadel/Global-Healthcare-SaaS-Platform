import { Router, Request, Response } from "express";

const router: Router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    service: "notification-service",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get("/ready", (_req: Request, res: Response) => {
  res.json({
    status: "ready",
    service: "notification-service",
    timestamp: new Date().toISOString(),
  });
});

router.get("/live", (_req: Request, res: Response) => {
  res.json({
    status: "live",
    service: "notification-service",
    timestamp: new Date().toISOString(),
  });
});

export { router as healthRoutes };

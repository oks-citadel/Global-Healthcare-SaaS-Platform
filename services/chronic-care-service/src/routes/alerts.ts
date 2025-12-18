import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { UserRequest, requireUser } from '../middleware/extractUser';

const router = Router();
const prisma = new PrismaClient();

router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { status } = req.query;
    const where: any = {};

    if (userRole === 'patient') {
      where.patientId = userId;
    }

    if (status) {
      where.status = status;
    }

    const alerts = await prisma.alert.findMany({
      where,
      orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
    });

    res.json({ data: alerts, count: alerts.length });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch alerts' });
  }
});

router.patch('/:id/acknowledge', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const alert = await prisma.alert.update({
      where: { id },
      data: { status: 'acknowledged', acknowledgedBy: userId, acknowledgedAt: new Date() },
    });

    res.json({ data: alert, message: 'Alert acknowledged' });
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to acknowledge alert' });
  }
});

export default router;

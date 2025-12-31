import { PrismaClient, VisitStatus, VisitType, VisitPriority, TaskCompletionStatus } from '../generated/client';

const prisma = new PrismaClient();

export interface CreateVisitInput {
  patientId: string;
  patientHomeId: string;
  caregiverId: string;
  scheduledDate: Date;
  scheduledStartTime: string;
  scheduledEndTime: string;
  estimatedDuration: number;
  visitType: VisitType;
  priority?: VisitPriority;
  reasonForVisit?: string;
  tasks?: CreateVisitTaskInput[];
}

export interface CreateVisitTaskInput {
  taskType: string;
  title: string;
  description?: string;
  isRequired?: boolean;
  sequence?: number;
  vitalType?: string;
}

export interface UpdateVisitInput {
  scheduledDate?: Date;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  caregiverId?: string;
  status?: VisitStatus;
  priority?: VisitPriority;
  reasonForVisit?: string;
  clinicalNotes?: string;
  patientCondition?: string;
  followUpRequired?: boolean;
  followUpNotes?: string;
}

export class VisitService {
  async createVisit(data: CreateVisitInput) {
    const { tasks, ...visitData } = data;

    return await prisma.homeVisit.create({
      data: {
        ...visitData,
        priority: visitData.priority || 'routine',
        tasks: tasks ? {
          create: tasks.map((task, index) => ({
            taskType: task.taskType as any,
            title: task.title,
            description: task.description,
            isRequired: task.isRequired ?? true,
            sequence: task.sequence ?? index,
            vitalType: task.vitalType,
          })),
        } : undefined,
      },
      include: {
        caregiver: true,
        patientHome: true,
        tasks: true,
      },
    });
  }

  async getVisitById(id: string) {
    return await prisma.homeVisit.findUnique({
      where: { id },
      include: {
        caregiver: true,
        patientHome: true,
        tasks: { orderBy: { sequence: 'asc' } },
        evvRecords: { orderBy: { timestamp: 'asc' } },
        medications: true,
        incidents: true,
        documentation: true,
      },
    });
  }

  async getVisitsForPatient(patientId: string, options?: {
    status?: VisitStatus;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: any = { patientId };

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.startDate || options?.endDate) {
      where.scheduledDate = {};
      if (options.startDate) where.scheduledDate.gte = options.startDate;
      if (options.endDate) where.scheduledDate.lte = options.endDate;
    }

    const [visits, total] = await Promise.all([
      prisma.homeVisit.findMany({
        where,
        include: {
          caregiver: true,
          patientHome: true,
          tasks: true,
        },
        orderBy: { scheduledDate: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0,
      }),
      prisma.homeVisit.count({ where }),
    ]);

    return { visits, total };
  }

  async getVisitsForCaregiver(caregiverId: string, options?: {
    status?: VisitStatus;
    date?: Date;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = { caregiverId };

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.date) {
      const startOfDay = new Date(options.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(options.date);
      endOfDay.setHours(23, 59, 59, 999);
      where.scheduledDate = { gte: startOfDay, lte: endOfDay };
    } else if (options?.startDate || options?.endDate) {
      where.scheduledDate = {};
      if (options?.startDate) where.scheduledDate.gte = options.startDate;
      if (options?.endDate) where.scheduledDate.lte = options.endDate;
    }

    return await prisma.homeVisit.findMany({
      where,
      include: {
        patientHome: true,
        tasks: { orderBy: { sequence: 'asc' } },
      },
      orderBy: [{ scheduledDate: 'asc' }, { scheduledStartTime: 'asc' }],
    });
  }

  async updateVisit(id: string, data: UpdateVisitInput) {
    return await prisma.homeVisit.update({
      where: { id },
      data,
      include: {
        caregiver: true,
        patientHome: true,
        tasks: true,
      },
    });
  }

  async startVisit(id: string, location: { latitude: number; longitude: number }) {
    return await prisma.homeVisit.update({
      where: { id },
      data: {
        status: 'in_progress',
        actualStartTime: new Date(),
        startLatitude: location.latitude,
        startLongitude: location.longitude,
      },
    });
  }

  async completeVisit(id: string, data: {
    location: { latitude: number; longitude: number };
    clinicalNotes?: string;
    patientCondition?: string;
    followUpRequired?: boolean;
    followUpNotes?: string;
    caregiverSignature?: string;
    patientSignature?: string;
  }) {
    const visit = await prisma.homeVisit.findUnique({ where: { id } });
    if (!visit) throw new Error('Visit not found');

    const actualEndTime = new Date();
    const actualDuration = visit.actualStartTime
      ? Math.round((actualEndTime.getTime() - visit.actualStartTime.getTime()) / 60000)
      : null;

    return await prisma.homeVisit.update({
      where: { id },
      data: {
        status: 'completed',
        actualEndTime,
        actualDuration,
        endLatitude: data.location.latitude,
        endLongitude: data.location.longitude,
        clinicalNotes: data.clinicalNotes,
        patientCondition: data.patientCondition,
        followUpRequired: data.followUpRequired,
        followUpNotes: data.followUpNotes,
        caregiverSignature: data.caregiverSignature,
        patientSignature: data.patientSignature,
        signedAt: data.caregiverSignature || data.patientSignature ? new Date() : null,
      },
      include: {
        caregiver: true,
        patientHome: true,
        tasks: true,
        evvRecords: true,
      },
    });
  }

  async cancelVisit(id: string, reason?: string) {
    return await prisma.homeVisit.update({
      where: { id },
      data: {
        status: 'cancelled',
        clinicalNotes: reason,
      },
    });
  }

  async rescheduleVisit(id: string, newDate: Date, newStartTime: string, newEndTime: string) {
    // Mark current visit as rescheduled
    await prisma.homeVisit.update({
      where: { id },
      data: { status: 'rescheduled' },
    });

    // Get original visit details
    const originalVisit = await prisma.homeVisit.findUnique({
      where: { id },
      include: { tasks: true },
    });

    if (!originalVisit) throw new Error('Visit not found');

    // Create new visit with updated schedule
    return await prisma.homeVisit.create({
      data: {
        patientId: originalVisit.patientId,
        patientHomeId: originalVisit.patientHomeId,
        caregiverId: originalVisit.caregiverId,
        scheduledDate: newDate,
        scheduledStartTime: newStartTime,
        scheduledEndTime: newEndTime,
        estimatedDuration: originalVisit.estimatedDuration,
        visitType: originalVisit.visitType,
        priority: originalVisit.priority,
        reasonForVisit: originalVisit.reasonForVisit,
        tasks: {
          create: originalVisit.tasks.map(task => ({
            taskType: task.taskType,
            title: task.title,
            description: task.description,
            isRequired: task.isRequired,
            sequence: task.sequence,
            vitalType: task.vitalType,
          })),
        },
      },
      include: {
        caregiver: true,
        patientHome: true,
        tasks: true,
      },
    });
  }

  async updateTaskStatus(taskId: string, status: TaskCompletionStatus, data?: {
    notes?: string;
    completedBy?: string;
    vitalValue?: number;
    vitalUnit?: string;
  }) {
    return await prisma.visitTask.update({
      where: { id: taskId },
      data: {
        status,
        completedAt: status === 'completed' ? new Date() : null,
        completedBy: data?.completedBy,
        notes: data?.notes,
        vitalValue: data?.vitalValue,
        vitalUnit: data?.vitalUnit,
      },
    });
  }

  async getVisitTasks(visitId: string) {
    return await prisma.visitTask.findMany({
      where: { visitId },
      orderBy: { sequence: 'asc' },
    });
  }

  async addVisitTask(visitId: string, task: CreateVisitTaskInput) {
    const lastTask = await prisma.visitTask.findFirst({
      where: { visitId },
      orderBy: { sequence: 'desc' },
    });

    return await prisma.visitTask.create({
      data: {
        visitId,
        taskType: task.taskType as any,
        title: task.title,
        description: task.description,
        isRequired: task.isRequired ?? true,
        sequence: task.sequence ?? (lastTask?.sequence ?? 0) + 1,
        vitalType: task.vitalType,
      },
    });
  }

  async getTodaysVisits(caregiverId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const where: any = {
      scheduledDate: { gte: today, lt: tomorrow },
    };

    if (caregiverId) {
      where.caregiverId = caregiverId;
    }

    return await prisma.homeVisit.findMany({
      where,
      include: {
        caregiver: true,
        patientHome: true,
        tasks: { orderBy: { sequence: 'asc' } },
      },
      orderBy: { scheduledStartTime: 'asc' },
    });
  }

  async getVisitStats(caregiverId: string, startDate: Date, endDate: Date) {
    const visits = await prisma.homeVisit.findMany({
      where: {
        caregiverId,
        scheduledDate: { gte: startDate, lte: endDate },
      },
    });

    const stats = {
      total: visits.length,
      completed: visits.filter(v => v.status === 'completed').length,
      cancelled: visits.filter(v => v.status === 'cancelled').length,
      noShow: visits.filter(v => v.status === 'no_show').length,
      inProgress: visits.filter(v => v.status === 'in_progress').length,
      scheduled: visits.filter(v => v.status === 'scheduled').length,
      totalDuration: visits.reduce((sum, v) => sum + (v.actualDuration || 0), 0),
      averageDuration: 0,
    };

    if (stats.completed > 0) {
      stats.averageDuration = Math.round(stats.totalDuration / stats.completed);
    }

    return stats;
  }
}

export default new VisitService();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CarePlanTemplateService {
  async getAllTemplates(condition?: string, isActive: boolean = true) {
    const where: any = { isActive };

    if (condition) {
      where.condition = condition;
    }

    return await prisma.carePlanTemplate.findMany({
      where,
      orderBy: [{ condition: 'asc' }, { version: 'desc' }],
    });
  }

  async getTemplateById(id: string) {
    return await prisma.carePlanTemplate.findUnique({
      where: { id },
    });
  }

  async getTemplatesByCondition(condition: string) {
    return await prisma.carePlanTemplate.findMany({
      where: { condition, isActive: true },
      orderBy: { version: 'desc' },
    });
  }

  async createTemplate(data: {
    name: string;
    condition: string;
    description?: string;
    goals: any;
    interventions: any;
    tasks: any;
    reviewSchedule?: string;
    thresholds: any;
  }) {
    return await prisma.carePlanTemplate.create({
      data,
    });
  }

  async updateTemplate(id: string, data: Partial<{
    name: string;
    description: string;
    goals: any;
    interventions: any;
    tasks: any;
    reviewSchedule: string;
    thresholds: any;
    isActive: boolean;
  }>) {
    return await prisma.carePlanTemplate.update({
      where: { id },
      data,
    });
  }

  async deactivateTemplate(id: string) {
    return await prisma.carePlanTemplate.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async createNewVersion(templateId: string, updates: any) {
    const existingTemplate = await this.getTemplateById(templateId);

    if (!existingTemplate) {
      throw new Error('Template not found');
    }

    // Deactivate old version
    await this.deactivateTemplate(templateId);

    // Create new version
    return await prisma.carePlanTemplate.create({
      data: {
        name: existingTemplate.name,
        condition: existingTemplate.condition,
        description: existingTemplate.description,
        goals: updates.goals || existingTemplate.goals,
        interventions: updates.interventions || existingTemplate.interventions,
        tasks: updates.tasks || existingTemplate.tasks,
        reviewSchedule: updates.reviewSchedule || existingTemplate.reviewSchedule,
        thresholds: updates.thresholds || existingTemplate.thresholds,
        version: existingTemplate.version + 1,
        isActive: true,
      },
    });
  }
}

export default new CarePlanTemplateService();

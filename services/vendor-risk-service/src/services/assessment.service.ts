import {
  PrismaClient,
  Assessment,
  AssessmentType,
  AssessmentStatus,
  QuestionnaireResponse,
  QuestionnaireStatus,
  QuestionnaireTemplate,
} from '../generated/client';
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

export interface CreateAssessmentData {
  vendorId: string;
  type: AssessmentType;
  dueDate?: Date;
  reviewer?: string;
  reviewerEmail?: string;
  createdBy?: string;
}

export interface UpdateAssessmentData {
  status?: AssessmentStatus;
  completedDate?: Date;
  score?: number;
  maxScore?: number;
  passThreshold?: number;
  passed?: boolean;
  findings?: Record<string, unknown>;
  recommendations?: string;
  attachments?: Record<string, unknown>[];
}

export interface QuestionnaireResponseData {
  responses: Record<string, unknown>;
  percentComplete: number;
}

export interface AssessmentFilters {
  vendorId?: string;
  type?: AssessmentType;
  status?: AssessmentStatus;
  dueBefore?: Date;
  dueAfter?: Date;
  limit?: number;
  offset?: number;
}

export class AssessmentService {
  async createAssessment(data: CreateAssessmentData): Promise<Assessment> {
    // Set default due date based on assessment type
    const defaultDueDays: Record<AssessmentType, number> = {
      INITIAL_ONBOARDING: 30,
      ANNUAL_REVIEW: 60,
      AD_HOC: 14,
      SIG_CORE: 45,
      SIG_LITE: 30,
      CAIQ: 30,
      HECVAT: 45,
      VSAQ: 14,
      CUSTOM: 30,
    };

    const dueDate = data.dueDate || addDays(new Date(), defaultDueDays[data.type] || 30);

    return prisma.assessment.create({
      data: {
        vendorId: data.vendorId,
        type: data.type,
        dueDate,
        reviewer: data.reviewer,
        reviewerEmail: data.reviewerEmail,
        createdBy: data.createdBy,
      },
    });
  }

  async getAssessment(id: string): Promise<Assessment | null> {
    return prisma.assessment.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            category: true,
            tier: true,
          },
        },
      },
    });
  }

  async listAssessments(filters: AssessmentFilters): Promise<{ assessments: Assessment[]; total: number }> {
    const where: Record<string, unknown> = {};

    if (filters.vendorId) where.vendorId = filters.vendorId;
    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;

    if (filters.dueBefore || filters.dueAfter) {
      where.dueDate = {};
      if (filters.dueBefore) (where.dueDate as Record<string, Date>).lte = filters.dueBefore;
      if (filters.dueAfter) (where.dueDate as Record<string, Date>).gte = filters.dueAfter;
    }

    const [assessments, total] = await Promise.all([
      prisma.assessment.findMany({
        where: where as Parameters<typeof prisma.assessment.findMany>[0]['where'],
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
        },
        orderBy: { dueDate: 'asc' },
        take: filters.limit || 50,
        skip: filters.offset || 0,
      }),
      prisma.assessment.count({ where: where as Parameters<typeof prisma.assessment.count>[0]['where'] }),
    ]);

    return { assessments, total };
  }

  async updateAssessment(id: string, data: UpdateAssessmentData): Promise<Assessment> {
    // If marking as completed, set completedDate
    const updateData: Record<string, unknown> = { ...data };
    if (data.status === AssessmentStatus.APPROVED || data.status === AssessmentStatus.REJECTED) {
      updateData.completedDate = new Date();

      // Determine passed status based on score if not explicitly set
      if (data.passed === undefined && data.score !== undefined && data.passThreshold !== undefined) {
        updateData.passed = data.score >= data.passThreshold;
      }
    }

    return prisma.assessment.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.assessment.update>[0]['data'],
    });
  }

  async submitAssessmentForReview(id: string, findings: Record<string, unknown>): Promise<Assessment> {
    return prisma.assessment.update({
      where: { id },
      data: {
        status: AssessmentStatus.UNDER_REVIEW,
        findings: findings as any,
      },
    });
  }

  async getOverdueAssessments(): Promise<Assessment[]> {
    return prisma.assessment.findMany({
      where: {
        status: {
          in: [AssessmentStatus.PENDING, AssessmentStatus.IN_PROGRESS],
        },
        dueDate: {
          lt: new Date(),
        },
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            primaryContactEmail: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async getUpcomingAssessments(daysAhead: number = 30): Promise<Assessment[]> {
    const futureDate = addDays(new Date(), daysAhead);

    return prisma.assessment.findMany({
      where: {
        status: {
          in: [AssessmentStatus.PENDING, AssessmentStatus.IN_PROGRESS],
        },
        dueDate: {
          gte: new Date(),
          lte: futureDate,
        },
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            primaryContactEmail: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  // Questionnaire Management

  async getQuestionnaireTemplates(type?: string): Promise<QuestionnaireTemplate[]> {
    const where: Record<string, unknown> = { isActive: true };
    if (type) where.type = type;

    return prisma.questionnaireTemplate.findMany({
      where: where as Parameters<typeof prisma.questionnaireTemplate.findMany>[0]['where'],
      orderBy: [{ type: 'asc' }, { version: 'desc' }],
    });
  }

  async createQuestionnaireResponse(
    vendorId: string,
    templateId: string,
    expiresInDays: number = 60
  ): Promise<QuestionnaireResponse> {
    return prisma.questionnaireResponse.create({
      data: {
        vendorId,
        templateId,
        expiresAt: addDays(new Date(), expiresInDays),
      },
    });
  }

  async getQuestionnaireResponse(id: string): Promise<QuestionnaireResponse | null> {
    return prisma.questionnaireResponse.findUnique({
      where: { id },
      include: {
        template: true,
        vendor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async updateQuestionnaireResponse(
    id: string,
    data: QuestionnaireResponseData
  ): Promise<QuestionnaireResponse> {
    const currentResponse = await prisma.questionnaireResponse.findUnique({
      where: { id },
    });

    if (!currentResponse) {
      throw new Error('Questionnaire response not found');
    }

    // Merge existing responses with new ones
    const mergedResponses = {
      ...(currentResponse.responses as Record<string, unknown> || {}),
      ...data.responses,
    };

    return prisma.questionnaireResponse.update({
      where: { id },
      data: {
        responses: mergedResponses as any,
        percentComplete: data.percentComplete,
        status: data.percentComplete === 100 ? QuestionnaireStatus.SUBMITTED : QuestionnaireStatus.IN_PROGRESS,
        submittedAt: data.percentComplete === 100 ? new Date() : undefined,
      },
    });
  }

  async submitQuestionnaire(id: string): Promise<QuestionnaireResponse> {
    return prisma.questionnaireResponse.update({
      where: { id },
      data: {
        status: QuestionnaireStatus.SUBMITTED,
        submittedAt: new Date(),
        percentComplete: 100,
      },
    });
  }

  async reviewQuestionnaire(
    id: string,
    reviewedBy: string,
    approved: boolean,
    reviewNotes?: string,
    score?: number,
    maxScore?: number
  ): Promise<QuestionnaireResponse> {
    return prisma.questionnaireResponse.update({
      where: { id },
      data: {
        status: approved ? QuestionnaireStatus.APPROVED : QuestionnaireStatus.REJECTED,
        reviewedAt: new Date(),
        reviewedBy,
        reviewNotes,
        score,
        maxScore,
      },
    });
  }

  async getVendorQuestionnaires(vendorId: string): Promise<QuestionnaireResponse[]> {
    return prisma.questionnaireResponse.findMany({
      where: { vendorId },
      include: {
        template: {
          select: {
            name: true,
            type: true,
            version: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Initialize default questionnaire templates
  async seedQuestionnaireTemplates(): Promise<void> {
    const templates = [
      {
        name: 'SIG Lite',
        version: '2024.1',
        type: 'SIG_LITE' as const,
        description: 'Standardized Information Gathering (SIG) Lite questionnaire for lower-risk vendors',
        totalQuestions: 50,
        sections: JSON.stringify([
          {
            id: 'security-policies',
            title: 'Security Policies',
            questions: [
              { id: 'SP-1', text: 'Does your organization have a documented information security policy?', type: 'boolean' },
              { id: 'SP-2', text: 'Is the security policy reviewed and updated at least annually?', type: 'boolean' },
            ],
          },
          {
            id: 'access-control',
            title: 'Access Control',
            questions: [
              { id: 'AC-1', text: 'Is access to systems based on the principle of least privilege?', type: 'boolean' },
              { id: 'AC-2', text: 'Is multi-factor authentication required for remote access?', type: 'boolean' },
            ],
          },
        ]),
      },
      {
        name: 'SIG Core',
        version: '2024.1',
        type: 'SIG_CORE' as const,
        description: 'Standardized Information Gathering (SIG) Core questionnaire for comprehensive vendor assessment',
        totalQuestions: 200,
        sections: JSON.stringify([
          {
            id: 'governance',
            title: 'Governance',
            questions: [
              { id: 'GOV-1', text: 'Does your organization have an information security governance program?', type: 'boolean' },
            ],
          },
        ]),
      },
      {
        name: 'CAIQ',
        version: 'v4.0',
        type: 'CAIQ' as const,
        description: 'Cloud Security Alliance Consensus Assessment Initiative Questionnaire',
        totalQuestions: 300,
        sections: JSON.stringify([
          {
            id: 'audit-assurance',
            title: 'Audit & Assurance',
            questions: [
              { id: 'A&A-01', text: 'Are independent audits performed at least annually?', type: 'boolean' },
            ],
          },
        ]),
      },
    ];

    for (const template of templates) {
      await prisma.questionnaireTemplate.upsert({
        where: {
          name_version: {
            name: template.name,
            version: template.version,
          },
        },
        update: {},
        create: {
          name: template.name,
          version: template.version,
          type: template.type,
          description: template.description,
          totalQuestions: template.totalQuestions,
          sections: JSON.parse(template.sections),
        },
      });
    }
  }
}

export default new AssessmentService();

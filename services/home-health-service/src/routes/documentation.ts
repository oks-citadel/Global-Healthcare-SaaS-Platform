import { Router } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser, requireCaregiver, requireSupervisor } from '../middleware/extractUser';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Validation schemas
const createDocumentSchema = z.object({
  visitId: z.string().uuid(),
  documentType: z.enum([
    'progress_note', 'assessment', 'care_plan', 'physician_order',
    'consent_form', 'discharge_summary', 'wound_photo', 'vital_signs_log',
    'medication_list', 'family_communication', 'other'
  ]),
  title: z.string(),
  content: z.string().optional(),
  fileUrl: z.string().optional(),
  fileType: z.string().optional(),
  fileSize: z.number().optional(),
  assessmentData: z.record(z.any()).optional(),
});

const homeAssessmentSchema = z.object({
  patientHomeId: z.string().uuid(),
  safetyScore: z.number().min(0).max(100).optional(),
  fallRisk: z.enum(['low', 'moderate', 'high', 'critical']).optional(),
  fireRisk: z.enum(['low', 'moderate', 'high', 'critical']).optional(),
  infectionRisk: z.enum(['low', 'moderate', 'high', 'critical']).optional(),
  cleanlinessScore: z.number().min(0).max(100).optional(),
  adequateLighting: z.boolean().optional(),
  adequateVentilation: z.boolean().optional(),
  workingUtilities: z.boolean().optional(),
  bathroomAccessible: z.boolean().optional(),
  bedroomAccessible: z.boolean().optional(),
  kitchenAccessible: z.boolean().optional(),
  recommendations: z.array(z.any()).optional(),
  requiredEquipment: z.array(z.string()).optional(),
  followUpDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

const incidentReportSchema = z.object({
  patientId: z.string().uuid(),
  visitId: z.string().uuid().optional(),
  caregiverId: z.string().uuid().optional(),
  incidentType: z.enum([
    'fall', 'medication_error', 'skin_injury', 'equipment_malfunction',
    'behavioral', 'environmental', 'security', 'missing_patient',
    'abuse_neglect', 'other'
  ]),
  severity: z.enum(['minor', 'moderate', 'major', 'critical']),
  occurredAt: z.string().datetime(),
  location: z.string().optional(),
  description: z.string(),
  immediateAction: z.string().optional(),
  witnessNames: z.string().optional(),
  fallType: z.enum(['witnessed', 'unwitnessed', 'near_miss', 'assisted_to_floor']).optional(),
  injuryOccurred: z.boolean().optional(),
  injuryDescription: z.string().optional(),
  medicalAttentionRequired: z.boolean().optional(),
  emergencyServicesNotified: z.boolean().optional(),
});

const familyCommunicationSchema = z.object({
  patientId: z.string().uuid(),
  familyMemberId: z.string().uuid().optional(),
  visitId: z.string().uuid().optional(),
  communicationType: z.enum([
    'visit_update', 'schedule_change', 'medication_reminder',
    'care_plan_update', 'general_inquiry', 'emergency_notification',
    'documentation_shared', 'feedback', 'other'
  ]),
  subject: z.string().optional(),
  message: z.string(),
});

// Create visit documentation
router.post('/', requireUser, requireCaregiver, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const validatedData = createDocumentSchema.parse(req.body);

    const document = await prisma.visitDocumentation.create({
      data: {
        ...validatedData,
        createdBy: userId,
      } as any,
    });

    res.status(201).json({ data: document, message: 'Documentation created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating documentation:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create documentation' });
  }
});

// Get documentation for a visit
router.get('/visit/:visitId', requireUser, async (req: UserRequest, res) => {
  try {
    const documents = await prisma.visitDocumentation.findMany({
      where: { visitId: req.params.visitId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: documents, count: documents.length });
  } catch (error) {
    console.error('Error fetching documentation:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch documentation' });
  }
});

// Get document by ID
router.get('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const document = await prisma.visitDocumentation.findUnique({
      where: { id: req.params.id },
      include: { visit: true },
    });

    if (!document) {
      res.status(404).json({ error: 'Not Found', message: 'Document not found' });
      return;
    }

    res.json({ data: document });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch document' });
  }
});

// Update document
router.patch('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { title, content, assessmentData } = req.body;

    const document = await prisma.visitDocumentation.update({
      where: { id: req.params.id },
      data: { title, content, assessmentData },
    });

    res.json({ data: document, message: 'Document updated successfully' });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update document' });
  }
});

// Create home assessment
router.post('/home-assessment', requireUser, requireCaregiver, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const validatedData = homeAssessmentSchema.parse(req.body);

    const assessment = await prisma.homeAssessment.create({
      data: {
        ...validatedData,
        assessorId: userId,
        followUpDate: validatedData.followUpDate ? new Date(validatedData.followUpDate) : null,
      } as any,
    });

    res.status(201).json({ data: assessment, message: 'Home assessment created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating assessment:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create assessment' });
  }
});

// Get home assessments for a patient home
router.get('/home-assessment/:patientHomeId', requireUser, async (req: UserRequest, res) => {
  try {
    const assessments = await prisma.homeAssessment.findMany({
      where: { patientHomeId: req.params.patientHomeId },
      orderBy: { assessmentDate: 'desc' },
    });

    res.json({ data: assessments, count: assessments.length });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch assessments' });
  }
});

// Report incident
router.post('/incidents', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = incidentReportSchema.parse(req.body);

    const incident = await prisma.incident.create({
      data: {
        ...validatedData,
        occurredAt: new Date(validatedData.occurredAt),
      } as any,
    });

    res.status(201).json({ data: incident, message: 'Incident reported successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error reporting incident:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to report incident' });
  }
});

// Get incidents
router.get('/incidents', requireUser, async (req: UserRequest, res) => {
  try {
    const { patientId, status, severity, startDate, endDate, limit, offset } = req.query;

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;
    if (severity) where.severity = severity;
    if (startDate || endDate) {
      where.occurredAt = {};
      if (startDate) where.occurredAt.gte = new Date(startDate as string);
      if (endDate) where.occurredAt.lte = new Date(endDate as string);
    }

    const incidents = await prisma.incident.findMany({
      where,
      orderBy: { occurredAt: 'desc' },
      take: limit ? parseInt(limit as string) : 50,
      skip: offset ? parseInt(offset as string) : 0,
    });

    const total = await prisma.incident.count({ where });

    res.json({ data: incidents, total });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch incidents' });
  }
});

// Get incident by ID
router.get('/incidents/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const incident = await prisma.incident.findUnique({
      where: { id: req.params.id },
      include: { visit: true },
    });

    if (!incident) {
      res.status(404).json({ error: 'Not Found', message: 'Incident not found' });
      return;
    }

    res.json({ data: incident });
  } catch (error) {
    console.error('Error fetching incident:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch incident' });
  }
});

// Update incident status (investigation)
router.patch('/incidents/:id', requireUser, requireSupervisor, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const { status, rootCause, preventiveMeasures, familyNotified, physicianNotified, supervisorNotified } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (rootCause) updateData.rootCause = rootCause;
    if (preventiveMeasures) updateData.preventiveMeasures = preventiveMeasures;
    if (familyNotified !== undefined) updateData.familyNotified = familyNotified;
    if (physicianNotified !== undefined) updateData.physicianNotified = physicianNotified;
    if (supervisorNotified !== undefined) updateData.supervisorNotified = supervisorNotified;

    if (status === 'investigated') {
      updateData.investigatedBy = userId;
      updateData.investigatedAt = new Date();
    }

    const incident = await prisma.incident.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json({ data: incident, message: 'Incident updated successfully' });
  } catch (error) {
    console.error('Error updating incident:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update incident' });
  }
});

// Send family communication
router.post('/family-communication', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const caregiver = await prisma.caregiver.findUnique({ where: { userId } });

    const validatedData = familyCommunicationSchema.parse(req.body);

    const communication = await prisma.familyCommunication.create({
      data: {
        ...validatedData,
        caregiverId: caregiver?.id,
      } as any,
    });

    res.status(201).json({ data: communication, message: 'Message sent successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error sending communication:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to send message' });
  }
});

// Get family communications for a patient
router.get('/family-communication/:patientId', requireUser, async (req: UserRequest, res) => {
  try {
    const communications = await prisma.familyCommunication.findMany({
      where: { patientId: req.params.patientId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: communications, count: communications.length });
  } catch (error) {
    console.error('Error fetching communications:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch communications' });
  }
});

// Mark communication as read
router.patch('/family-communication/:id/read', requireUser, async (req: UserRequest, res) => {
  try {
    const communication = await prisma.familyCommunication.update({
      where: { id: req.params.id },
      data: { isRead: true, readAt: new Date() },
    });

    res.json({ data: communication });
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to mark as read' });
  }
});

// Get patient equipment
router.get('/equipment/:patientHomeId', requireUser, async (req: UserRequest, res) => {
  try {
    const equipment = await prisma.patientEquipment.findMany({
      where: { patientHomeId: req.params.patientHomeId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: equipment, count: equipment.length });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch equipment' });
  }
});

// Add equipment
router.post('/equipment', requireUser, async (req: UserRequest, res) => {
  try {
    const equipment = await prisma.patientEquipment.create({
      data: {
        patientHomeId: req.body.patientHomeId,
        equipmentType: req.body.equipmentType,
        name: req.body.name,
        serialNumber: req.body.serialNumber,
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        status: req.body.status || 'active',
        condition: req.body.condition || 'good',
        deliveredDate: req.body.deliveredDate ? new Date(req.body.deliveredDate) : null,
        expectedReturnDate: req.body.expectedReturnDate ? new Date(req.body.expectedReturnDate) : null,
        ownershipType: req.body.ownershipType || 'rental',
        rentalCompany: req.body.rentalCompany,
        monthlyRentalCost: req.body.monthlyRentalCost,
        notes: req.body.notes,
      },
    });

    res.status(201).json({ data: equipment, message: 'Equipment added successfully' });
  } catch (error) {
    console.error('Error adding equipment:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to add equipment' });
  }
});

// Update equipment status
router.patch('/equipment/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const updateData: any = {};
    const allowedFields = [
      'status', 'condition', 'returnedDate', 'lastMaintenanceDate',
      'nextMaintenanceDate', 'maintenanceNotes', 'notes'
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = ['returnedDate', 'lastMaintenanceDate', 'nextMaintenanceDate'].includes(field)
          ? new Date(req.body[field])
          : req.body[field];
      }
    }

    const equipment = await prisma.patientEquipment.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json({ data: equipment, message: 'Equipment updated successfully' });
  } catch (error) {
    console.error('Error updating equipment:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update equipment' });
  }
});

// Order supplies
router.post('/supplies/order', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;

    const order = await prisma.supplyOrder.create({
      data: {
        patientId: req.body.patientId,
        orderedBy: userId,
        items: req.body.items,
        totalCost: req.body.totalCost,
        expectedDelivery: req.body.expectedDelivery ? new Date(req.body.expectedDelivery) : null,
      },
    });

    res.status(201).json({ data: order, message: 'Supply order created successfully' });
  } catch (error) {
    console.error('Error creating supply order:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create supply order' });
  }
});

// Get supply orders for a patient
router.get('/supplies/:patientId', requireUser, async (req: UserRequest, res) => {
  try {
    const orders = await prisma.supplyOrder.findMany({
      where: { patientId: req.params.patientId },
      orderBy: { orderedAt: 'desc' },
    });

    res.json({ data: orders, count: orders.length });
  } catch (error) {
    console.error('Error fetching supply orders:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch supply orders' });
  }
});

// Update supply order status
router.patch('/supplies/order/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { status, deliveredAt, deliveryNotes } = req.body;

    const order = await prisma.supplyOrder.update({
      where: { id: req.params.id },
      data: {
        status,
        deliveredAt: deliveredAt ? new Date(deliveredAt) : undefined,
        deliveryNotes,
      },
    });

    res.json({ data: order, message: 'Supply order updated successfully' });
  } catch (error) {
    console.error('Error updating supply order:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update supply order' });
  }
});

// Get documentation summary for a patient
router.get('/summary/:patientId', requireUser, async (req: UserRequest, res) => {
  try {
    const patientHome = await prisma.patientHome.findUnique({
      where: { patientId: req.params.patientId },
    });

    if (!patientHome) {
      res.status(404).json({ error: 'Not Found', message: 'Patient home not found' });
      return;
    }

    const [
      recentVisits,
      assessments,
      incidents,
      equipment,
      communications,
    ] = await Promise.all([
      prisma.homeVisit.findMany({
        where: { patientId: req.params.patientId },
        include: { documentation: true },
        orderBy: { scheduledDate: 'desc' },
        take: 10,
      }),
      prisma.homeAssessment.findMany({
        where: { patientHomeId: patientHome.id },
        orderBy: { assessmentDate: 'desc' },
        take: 5,
      }),
      prisma.incident.findMany({
        where: { patientId: req.params.patientId },
        orderBy: { occurredAt: 'desc' },
        take: 5,
      }),
      prisma.patientEquipment.findMany({
        where: { patientHomeId: patientHome.id, status: 'active' },
      }),
      prisma.familyCommunication.findMany({
        where: { patientId: req.params.patientId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    res.json({
      data: {
        recentVisits,
        assessments,
        incidents,
        activeEquipment: equipment,
        recentCommunications: communications,
        summary: {
          totalVisits: recentVisits.length,
          totalAssessments: assessments.length,
          openIncidents: incidents.filter(i => i.status !== 'closed').length,
          activeEquipmentCount: equipment.length,
          unreadMessages: communications.filter(c => !c.isRead).length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch summary' });
  }
});

export default router;

import { PrismaClient } from '../generated/client';
import {
  AppealLetterRequest,
  AppealLetterResponse,
  PayerAppealStrategy,
  COMMON_CARC_CODES,
} from '../types';
import { addDays, format } from 'date-fns';

const prisma = new PrismaClient();

interface DenialDetails {
  id: string;
  claimId: string;
  patientId: string;
  providerId: string;
  payerId: string;
  payerName: string;
  carcCode: string;
  carcDescription: string;
  rarcCodes: string[];
  procedureCode: string;
  diagnosisCodes: string[];
  billedAmount: number;
  denialDate: Date;
  denialCategory: string;
}

export class AppealGenerationService {
  /**
   * Generate an appeal letter for a denial
   */
  async generateAppealLetter(request: AppealLetterRequest): Promise<AppealLetterResponse> {
    // Get denial details
    const denial = await prisma.denial.findUnique({
      where: { id: request.denialId },
    });

    if (!denial) {
      throw new Error('Denial not found');
    }

    // Get payer configuration
    const payerConfig = await prisma.payerConfig.findUnique({
      where: { payerId: denial.payerId },
    });

    // Calculate filing deadline
    const deadlineDays = this.getDeadlineDays(request.appealType, payerConfig);
    const filingDeadline = addDays(denial.denialDate, deadlineDays);

    // Get payer-specific strategy
    const strategy = await this.getPayerAppealStrategy(
      denial.payerId,
      denial.carcCode,
      denial.denialCategory
    );

    // Generate appeal letter content
    const { letterContent, letterHtml } = await this.generateLetterContent(
      denial as unknown as DenialDetails,
      request,
      strategy
    );

    // Determine required documents
    const suggestedDocuments = this.determineSuggestedDocuments(
      denial.denialCategory,
      request.appealType,
      payerConfig
    );

    // Get payer-specific requirements
    const payerSpecificRequirements = this.getPayerRequirements(payerConfig, denial.denialCategory);

    // Calculate success probability
    const successProbability = await this.calculateSuccessProbability(
      denial.payerId,
      denial.carcCode,
      request.appealType
    );

    // Create appeal record
    const appeal = await prisma.appeal.create({
      data: {
        denialId: request.denialId,
        appealLevel: request.appealType === 'external_review' ? 3 : 1,
        appealType: request.appealType,
        status: 'draft',
        appealLetterContent: letterContent,
        appealLetterHtml: letterHtml,
        supportingDocuments: request.medicalRecords || [],
        filingDeadline,
        payerAppealStrategy: strategy as any,
      },
    });

    return {
      appealId: appeal.id,
      letterContent,
      letterHtml,
      suggestedDocuments,
      payerSpecificRequirements,
      filingDeadline,
      successProbability,
    };
  }

  /**
   * Get deadline days based on appeal type and payer config
   */
  private getDeadlineDays(
    appealType: string,
    payerConfig: any | null
  ): number {
    if (payerConfig) {
      switch (appealType) {
        case 'external_review':
          return payerConfig.externalReviewDeadlineDays;
        case 'clinical_review':
        case 'peer_to_peer':
          return payerConfig.secondLevelDeadlineDays;
        default:
          return payerConfig.firstLevelDeadlineDays;
      }
    }

    // Default deadlines
    switch (appealType) {
      case 'external_review':
        return 120;
      case 'clinical_review':
      case 'peer_to_peer':
        return 60;
      default:
        return 60;
    }
  }

  /**
   * Get payer-specific appeal strategy
   */
  async getPayerAppealStrategy(
    payerId: string,
    carcCode: string,
    denialCategory: string
  ): Promise<PayerAppealStrategy> {
    const payerConfig = await prisma.payerConfig.findUnique({
      where: { payerId },
    });

    // Get historical success rates for this payer/denial type
    const historicalAppeals = await prisma.appeal.findMany({
      where: {
        denial: {
          payerId,
          carcCode,
        },
        outcome: { not: null },
      },
      include: {
        denial: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const successfulAppeals = historicalAppeals.filter(
      a => a.outcome === 'overturned_full' || a.outcome === 'overturned_partial'
    );
    const successRate = historicalAppeals.length > 0
      ? successfulAppeals.length / historicalAppeals.length
      : 0.3; // Default 30% if no history

    // Build strategy based on denial category
    const denialSpecificStrategies = this.getDenialSpecificStrategies(
      carcCode,
      denialCategory,
      successRate
    );

    return {
      payerId,
      payerName: payerConfig?.payerName || 'Unknown Payer',
      generalStrategy: this.getGeneralStrategy(denialCategory),
      denialSpecificStrategies,
      successFactors: this.getSuccessFactors(denialCategory),
      pitfallsToAvoid: this.getPitfallsToAvoid(denialCategory),
      contactInfo: {
        appealAddress: payerConfig?.appealAddress ? JSON.stringify(payerConfig.appealAddress) : undefined,
        faxNumber: payerConfig?.appealFaxNumber || undefined,
        email: payerConfig?.appealEmail || undefined,
        portalUrl: payerConfig?.appealPortalUrl || undefined,
      },
      deadlines: {
        firstLevel: payerConfig?.firstLevelDeadlineDays || 60,
        secondLevel: payerConfig?.secondLevelDeadlineDays || 60,
        externalReview: payerConfig?.externalReviewDeadlineDays || 120,
      },
      requiredDocuments: this.getRequiredDocuments(payerConfig, denialCategory),
      preferredSubmissionMethod: payerConfig?.acceptsElectronicAppeals
        ? 'electronic'
        : 'fax',
    };
  }

  /**
   * Generate letter content
   */
  private async generateLetterContent(
    denial: DenialDetails,
    request: AppealLetterRequest,
    strategy: PayerAppealStrategy
  ): Promise<{ letterContent: string; letterHtml: string }> {
    const today = format(new Date(), 'MMMM d, yyyy');
    const denialDateFormatted = format(new Date(denial.denialDate), 'MMMM d, yyyy');

    // Build arguments based on denial category
    const arguments_ = this.buildAppealArguments(denial, request);

    // Generate plain text letter
    const letterContent = this.generatePlainTextLetter(
      denial,
      today,
      denialDateFormatted,
      arguments_,
      strategy,
      request
    );

    // Generate HTML letter
    const letterHtml = this.generateHtmlLetter(
      denial,
      today,
      denialDateFormatted,
      arguments_,
      strategy,
      request
    );

    return { letterContent, letterHtml };
  }

  /**
   * Build appeal arguments based on denial category
   */
  private buildAppealArguments(
    denial: DenialDetails,
    request: AppealLetterRequest
  ): string[] {
    const category = denial.denialCategory;
    const arguments_: string[] = [];

    switch (category) {
      case 'prior_authorization':
        arguments_.push(
          'The prior authorization requirement was not applicable to this service at the time of treatment.',
          'Medical necessity warranted immediate treatment, which would have been compromised by authorization delays.',
          'The treating provider made reasonable efforts to obtain authorization prior to service.'
        );
        break;

      case 'medical_necessity':
        arguments_.push(
          'The service was medically necessary based on the patient\'s clinical presentation and medical history.',
          'Standard treatment guidelines and clinical evidence support this intervention.',
          'Alternative treatments were considered and determined to be less effective or inappropriate for this patient.',
          'Failure to provide this treatment would have resulted in patient harm or deterioration.'
        );
        break;

      case 'coding_error':
        arguments_.push(
          'Upon review, the original coding was appropriate for the services rendered.',
          'The procedure and diagnosis codes accurately reflect the documented medical record.',
          'The coding follows current CPT/ICD-10 guidelines and payer-specific requirements.'
        );
        break;

      case 'duplicate_claim':
        arguments_.push(
          'This claim represents a distinct service from any previously submitted claims.',
          'The date of service, procedure, and patient encounter are unique.',
          'Documentation confirms this was a separate medical event requiring its own billing.'
        );
        break;

      case 'timely_filing':
        arguments_.push(
          'The claim was originally submitted within the required timeframe.',
          'Delays in processing were due to circumstances beyond our control.',
          'We respectfully request an exception to the timely filing requirement.'
        );
        break;

      case 'eligibility':
        arguments_.push(
          'The patient was eligible for benefits on the date of service.',
          'Eligibility verification was performed prior to service.',
          'Any eligibility issues were the result of system or administrative errors.'
        );
        break;

      case 'bundling':
        arguments_.push(
          'The services billed represent distinct procedures that should not be bundled.',
          'Modifier 59 or XE/XP/XS/XU was appropriately applied to indicate separate services.',
          'Medical record documentation supports the distinct nature of each procedure.'
        );
        break;

      case 'documentation':
        arguments_.push(
          'Complete documentation is now being provided to support this claim.',
          'The enclosed medical records demonstrate medical necessity and appropriateness.',
          'All required clinical information is included in this appeal.'
        );
        break;

      default:
        arguments_.push(
          'We believe this claim was denied in error.',
          'The services provided were appropriate and meet all coverage requirements.',
          'We respectfully request reconsideration of this denial.'
        );
    }

    // Add any additional context provided
    if (request.additionalContext) {
      arguments_.push(request.additionalContext);
    }

    return arguments_;
  }

  /**
   * Generate plain text letter
   */
  private generatePlainTextLetter(
    denial: DenialDetails,
    today: string,
    denialDate: string,
    arguments_: string[],
    strategy: PayerAppealStrategy,
    request: AppealLetterRequest
  ): string {
    const carcDescription = COMMON_CARC_CODES[denial.carcCode] || denial.carcDescription;

    return `
${today}

${denial.payerName}
Appeals Department
${strategy.contactInfo.appealAddress || '[Payer Address]'}

RE: Appeal of Claim Denial
    Patient ID: ${denial.patientId}
    Claim Number: ${denial.claimId}
    Date of Service: ${format(new Date(denial.denialDate), 'MM/dd/yyyy')}
    Procedure Code: ${denial.procedureCode}
    Denial Date: ${denialDate}
    Denial Reason: ${carcDescription} (CARC ${denial.carcCode})
    Billed Amount: $${denial.billedAmount.toFixed(2)}

Dear Appeals Review Committee:

We are writing to formally appeal the denial of the above-referenced claim, which was denied on ${denialDate} with reason code ${denial.carcCode}: "${carcDescription}".

APPEAL TYPE: ${request.appealType.replace(/_/g, ' ').toUpperCase()}

SUMMARY OF APPEAL:

We respectfully disagree with the denial determination and request a full review of this claim for the following reasons:

${arguments_.map((arg, i) => `${i + 1}. ${arg}`).join('\n\n')}

SUPPORTING DOCUMENTATION:

The following documentation is enclosed to support this appeal:
- Complete medical records for date of service
- Provider notes and clinical documentation
${request.clinicalNotes ? '- Additional clinical notes as provided' : ''}
${request.medicalRecords?.map(doc => `- ${doc}`).join('\n') || ''}

REQUEST FOR ACTION:

Based on the above, we respectfully request that ${denial.payerName} overturn the denial and process this claim for payment in the amount of $${denial.billedAmount.toFixed(2)}.

If you require any additional information to process this appeal, please contact our office immediately at the number provided below.

Thank you for your prompt attention to this matter.

Sincerely,

[Provider Name]
[Provider NPI]
[Contact Phone]
[Contact Fax]

Enclosures: ${request.medicalRecords?.length || 0} document(s)
`.trim();
  }

  /**
   * Generate HTML letter
   */
  private generateHtmlLetter(
    denial: DenialDetails,
    today: string,
    denialDate: string,
    arguments_: string[],
    strategy: PayerAppealStrategy,
    request: AppealLetterRequest
  ): string {
    const carcDescription = COMMON_CARC_CODES[denial.carcCode] || denial.carcDescription;

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; margin: 1in; }
    .header { margin-bottom: 2em; }
    .date { margin-bottom: 1em; }
    .address { margin-bottom: 2em; }
    .re-block { margin-bottom: 2em; padding: 1em; background: #f5f5f5; border-left: 3px solid #333; }
    .re-block p { margin: 0.25em 0; }
    .section-header { font-weight: bold; margin-top: 1.5em; margin-bottom: 0.5em; text-transform: uppercase; }
    .arguments { margin-left: 1em; }
    .arguments li { margin-bottom: 0.75em; }
    .signature { margin-top: 3em; }
    .enclosures { margin-top: 2em; font-style: italic; }
  </style>
</head>
<body>
  <div class="header">
    <div class="date">${today}</div>

    <div class="address">
      ${denial.payerName}<br>
      Appeals Department<br>
      ${strategy.contactInfo.appealAddress || '[Payer Address]'}
    </div>
  </div>

  <div class="re-block">
    <p><strong>RE: Appeal of Claim Denial</strong></p>
    <p>Patient ID: ${denial.patientId}</p>
    <p>Claim Number: ${denial.claimId}</p>
    <p>Date of Service: ${format(new Date(denial.denialDate), 'MM/dd/yyyy')}</p>
    <p>Procedure Code: ${denial.procedureCode}</p>
    <p>Denial Date: ${denialDate}</p>
    <p>Denial Reason: ${carcDescription} (CARC ${denial.carcCode})</p>
    <p>Billed Amount: $${denial.billedAmount.toFixed(2)}</p>
  </div>

  <p>Dear Appeals Review Committee:</p>

  <p>We are writing to formally appeal the denial of the above-referenced claim, which was denied on ${denialDate} with reason code ${denial.carcCode}: "${carcDescription}".</p>

  <p><strong>APPEAL TYPE:</strong> ${request.appealType.replace(/_/g, ' ').toUpperCase()}</p>

  <div class="section-header">Summary of Appeal</div>
  <p>We respectfully disagree with the denial determination and request a full review of this claim for the following reasons:</p>

  <ol class="arguments">
    ${arguments_.map(arg => `<li>${arg}</li>`).join('\n    ')}
  </ol>

  <div class="section-header">Supporting Documentation</div>
  <p>The following documentation is enclosed to support this appeal:</p>
  <ul>
    <li>Complete medical records for date of service</li>
    <li>Provider notes and clinical documentation</li>
    ${request.clinicalNotes ? '<li>Additional clinical notes as provided</li>' : ''}
    ${request.medicalRecords?.map(doc => `<li>${doc}</li>`).join('\n    ') || ''}
  </ul>

  <div class="section-header">Request for Action</div>
  <p>Based on the above, we respectfully request that ${denial.payerName} overturn the denial and process this claim for payment in the amount of <strong>$${denial.billedAmount.toFixed(2)}</strong>.</p>

  <p>If you require any additional information to process this appeal, please contact our office immediately at the number provided below.</p>

  <p>Thank you for your prompt attention to this matter.</p>

  <div class="signature">
    <p>Sincerely,</p>
    <br><br><br>
    <p>[Provider Name]<br>
    [Provider NPI]<br>
    [Contact Phone]<br>
    [Contact Fax]</p>
  </div>

  <div class="enclosures">
    <p>Enclosures: ${request.medicalRecords?.length || 0} document(s)</p>
  </div>
</body>
</html>
`.trim();
  }

  /**
   * Get general strategy for denial category
   */
  private getGeneralStrategy(denialCategory: string): string {
    const strategies: Record<string, string> = {
      prior_authorization: 'Focus on demonstrating medical necessity and urgency. Include clinical evidence supporting immediate treatment need.',
      medical_necessity: 'Compile strong clinical documentation including guidelines, peer-reviewed literature, and detailed provider notes.',
      coding_error: 'Provide detailed code rationale with supporting documentation. Reference official coding guidelines.',
      duplicate_claim: 'Clearly document how this service differs from any similar claims. Include timeline and medical necessity.',
      timely_filing: 'Document original submission attempts with proof. Request exception with compelling reason.',
      eligibility: 'Provide eligibility verification documentation. Request retroactive correction if appropriate.',
      bundling: 'Document distinct services with modifier support. Include detailed operative or procedure notes.',
      documentation: 'Submit comprehensive documentation package with organized clinical records.',
    };

    return strategies[denialCategory] || 'Provide complete documentation supporting the claim with clear reasoning for appeal.';
  }

  /**
   * Get success factors for denial category
   */
  private getSuccessFactors(denialCategory: string): string[] {
    const factors: Record<string, string[]> = {
      prior_authorization: [
        'Evidence of retroactive authorization eligibility',
        'Documentation of medical urgency',
        'Peer-to-peer review with favorable outcome',
      ],
      medical_necessity: [
        'Comprehensive clinical documentation',
        'Published treatment guidelines supporting service',
        'Clear documentation of alternative treatment considerations',
      ],
      coding_error: [
        'Correct application of coding guidelines',
        'Modifier documentation support',
        'Clear linkage between diagnosis and procedure',
      ],
    };

    return factors[denialCategory] || [
      'Complete and organized documentation',
      'Clear statement of appeal rationale',
      'Timely submission within deadline',
    ];
  }

  /**
   * Get pitfalls to avoid
   */
  private getPitfallsToAvoid(denialCategory: string): string[] {
    return [
      'Missing filing deadline',
      'Incomplete documentation submission',
      'Failure to address specific denial reason',
      'Using incorrect appeal form or format',
      'Not including patient authorization if required',
    ];
  }

  /**
   * Get required documents based on payer config and denial category
   */
  private getRequiredDocuments(payerConfig: any | null, denialCategory: string): string[] {
    const docs: string[] = ['Appeal letter', 'Copy of EOB/Remittance'];

    if (payerConfig?.requiresClinicalNotes) {
      docs.push('Clinical notes from date of service');
    }
    if (payerConfig?.requiresMedicalRecords) {
      docs.push('Complete medical records');
    }
    if (payerConfig?.requiresLetterOfMedicalNecessity) {
      docs.push('Letter of Medical Necessity');
    }

    // Category-specific documents
    switch (denialCategory) {
      case 'prior_authorization':
        docs.push('Authorization request documentation');
        docs.push('Clinical urgency documentation');
        break;
      case 'medical_necessity':
        docs.push('Treatment plan');
        docs.push('Supporting clinical guidelines');
        break;
      case 'coding_error':
        docs.push('Operative/procedure report');
        docs.push('Coding rationale');
        break;
    }

    return docs;
  }

  /**
   * Determine suggested documents
   */
  private determineSuggestedDocuments(
    denialCategory: string,
    appealType: string,
    payerConfig: any | null
  ): string[] {
    const documents = this.getRequiredDocuments(payerConfig, denialCategory);

    // Add appeal-type specific documents
    if (appealType === 'peer_to_peer') {
      documents.push('Peer-to-peer review request form');
      documents.push('Provider availability schedule');
    }

    if (appealType === 'external_review') {
      documents.push('External review request form');
      documents.push('Complete claim file');
    }

    return documents;
  }

  /**
   * Get payer-specific requirements
   */
  private getPayerRequirements(payerConfig: any | null, denialCategory: string): string[] {
    const requirements: string[] = [];

    if (payerConfig) {
      if (!payerConfig.acceptsElectronicAppeals) {
        requirements.push('Appeals must be submitted via fax or mail');
      }
      if (payerConfig.specialInstructions) {
        requirements.push(payerConfig.specialInstructions);
      }
    }

    requirements.push('Include member ID and claim number on all pages');
    requirements.push('Maintain copy of all submitted documents');

    return requirements;
  }

  /**
   * Calculate success probability
   */
  private async calculateSuccessProbability(
    payerId: string,
    carcCode: string,
    appealType: string
  ): Promise<number> {
    const historicalAppeals = await prisma.appeal.findMany({
      where: {
        denial: { payerId, carcCode },
        appealType: appealType as any,
        outcome: { not: null },
      },
      select: { outcome: true },
    });

    if (historicalAppeals.length < 5) {
      // Not enough data, return baseline probability
      return 0.35;
    }

    const successful = historicalAppeals.filter(
      a => a.outcome === 'overturned_full' || a.outcome === 'overturned_partial'
    ).length;

    return successful / historicalAppeals.length;
  }

  /**
   * Get denial-specific strategies
   */
  private getDenialSpecificStrategies(
    carcCode: string,
    denialCategory: string,
    successRate: number
  ): PayerAppealStrategy['denialSpecificStrategies'] {
    return [{
      carcCode,
      category: denialCategory,
      strategy: this.getGeneralStrategy(denialCategory),
      keyArguments: this.getSuccessFactors(denialCategory),
      successRate,
    }];
  }

  /**
   * Update appeal with outcome
   */
  async updateAppealOutcome(
    appealId: string,
    outcome: 'overturned_full' | 'overturned_partial' | 'upheld' | 'withdrawn' | 'expired',
    adjustedAmount?: number,
    outcomeReason?: string
  ): Promise<void> {
    await prisma.appeal.update({
      where: { id: appealId },
      data: {
        outcome,
        adjustedAmount,
        outcomeReason,
        status: 'resolved',
        completedAt: new Date(),
      },
    });

    // If successful, update denial with recovery info
    if (outcome === 'overturned_full' || outcome === 'overturned_partial') {
      const appeal = await prisma.appeal.findUnique({
        where: { id: appealId },
        include: { denial: true },
      });

      if (appeal) {
        await prisma.denial.update({
          where: { id: appeal.denialId },
          data: {
            claimStatus: 'recovered',
            recoveredAmount: adjustedAmount || appeal.denial.billedAmount,
          },
        });
      }
    }
  }

  /**
   * Submit appeal
   */
  async submitAppeal(appealId: string, staffId: string): Promise<void> {
    await prisma.appeal.update({
      where: { id: appealId },
      data: {
        status: 'submitted',
        submittedDate: new Date(),
        completedBy: staffId,
      },
    });
  }
}

export default new AppealGenerationService();

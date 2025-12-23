import { PrismaClient, LabOrder, LabTest, LabResult } from '../generated/client';
import { PDFReportOptions } from '../types';
import logger from '../utils/logger';

export class ReportService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async generateLabReport(orderId: string, options?: PDFReportOptions): Promise<string> {
    try {
      const order = await this.prisma.labOrder.findUnique({
        where: { id: orderId },
        include: {
          tests: {
            include: {
              results: true,
            },
          },
        },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status !== 'completed') {
        throw new Error('Order is not completed yet');
      }

      // Generate PDF report content
      const reportContent = this.generateReportHTML(order, options);

      // In production, you would use a PDF generation library like puppeteer, pdfkit, or an external service
      // For now, we'll simulate PDF generation and return a URL
      const reportUrl = await this.savePDFReport(orderId, reportContent);

      // Update order with report URL
      await this.prisma.labOrder.update({
        where: { id: orderId },
        data: { reportUrl },
      });

      logger.info('Lab report generated', {
        orderId,
        reportUrl,
      });

      return reportUrl;
    } catch (error) {
      logger.error('Error generating lab report', { error, orderId });
      throw error;
    }
  }

  private generateReportHTML(
    order: LabOrder & { tests: (LabTest & { results: LabResult[] })[] },
    options?: PDFReportOptions
  ): string {
    const reportDate = new Date().toLocaleDateString();

    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Laboratory Report - ${order.orderNumber}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #0066cc;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #0066cc;
      margin: 0;
    }
    .info-section {
      margin-bottom: 30px;
    }
    .info-row {
      display: flex;
      margin-bottom: 10px;
    }
    .info-label {
      font-weight: bold;
      width: 150px;
    }
    .info-value {
      flex: 1;
    }
    .results-section {
      margin-top: 30px;
    }
    .test-group {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .test-header {
      background-color: #f0f0f0;
      padding: 10px;
      font-weight: bold;
      font-size: 16px;
      border-left: 4px solid #0066cc;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f8f8f8;
      font-weight: bold;
    }
    .abnormal {
      background-color: #fff3cd;
      font-weight: bold;
    }
    .critical {
      background-color: #f8d7da;
      font-weight: bold;
      color: #721c24;
    }
    .flag {
      font-weight: bold;
      margin-left: 5px;
    }
    .flag-H { color: #ff6b6b; }
    .flag-L { color: #4dabf7; }
    .flag-HH, .flag-LL { color: #c92a2a; }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
    }
    .signature-section {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      width: 45%;
    }
    .signature-line {
      border-top: 1px solid #333;
      margin-top: 50px;
      padding-top: 5px;
    }
    @media print {
      body { margin: 20px; }
      .page-break { page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>LABORATORY REPORT</h1>
    <p>UnifiedHealth Laboratory Services</p>
  </div>

  <div class="info-section">
    <h2>Order Information</h2>
    <div class="info-row">
      <div class="info-label">Order Number:</div>
      <div class="info-value">${order.orderNumber}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Patient ID:</div>
      <div class="info-value">${order.patientId}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Ordering Provider:</div>
      <div class="info-value">${order.providerId}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Order Date:</div>
      <div class="info-value">${order.orderedAt.toLocaleDateString()}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Collection Date:</div>
      <div class="info-value">${order.collectedAt?.toLocaleDateString() || 'N/A'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Completed Date:</div>
      <div class="info-value">${order.completedAt?.toLocaleDateString() || 'N/A'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Report Date:</div>
      <div class="info-value">${reportDate}</div>
    </div>
    ${
      order.clinicalInfo
        ? `
    <div class="info-row">
      <div class="info-label">Clinical Info:</div>
      <div class="info-value">${order.clinicalInfo}</div>
    </div>
    `
        : ''
    }
  </div>

  <div class="results-section">
    <h2>Test Results</h2>
    ${order.tests
      .map(
        (test) => `
      <div class="test-group">
        <div class="test-header">
          ${test.testName} (${test.testCode})
          <span style="float: right; font-weight: normal; font-size: 14px;">
            Category: ${test.category}
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Value</th>
              <th>Unit</th>
              <th>Reference Range</th>
              <th>Flag</th>
            </tr>
          </thead>
          <tbody>
            ${test.results
              .map(
                (result) => `
              <tr class="${result.isCritical ? 'critical' : result.isAbnormal ? 'abnormal' : ''}">
                <td>${result.componentName}</td>
                <td>${result.value}</td>
                <td>${result.unit || '-'}</td>
                <td>${result.referenceRange || '-'}</td>
                <td>
                  ${result.abnormalFlag ? `<span class="flag flag-${result.abnormalFlag}">${result.abnormalFlag}</span>` : '-'}
                </td>
              </tr>
              ${
                result.notes
                  ? `
              <tr>
                <td colspan="5" style="font-size: 12px; font-style: italic; padding-left: 30px;">
                  Note: ${result.notes}
                </td>
              </tr>
              `
                  : ''
              }
            `
              )
              .join('')}
          </tbody>
        </table>
        ${
          test.performedBy
            ? `
        <div style="margin-top: 10px; font-size: 12px;">
          <strong>Performed by:</strong> ${test.performedBy}
          ${test.performedAt ? ` on ${test.performedAt.toLocaleDateString()}` : ''}
        </div>
        `
            : ''
        }
        ${
          test.verifiedBy
            ? `
        <div style="font-size: 12px;">
          <strong>Verified by:</strong> ${test.verifiedBy}
          ${test.verifiedAt ? ` on ${test.verifiedAt.toLocaleDateString()}` : ''}
        </div>
        `
            : ''
        }
      </div>
    `
      )
      .join('')}
  </div>

  <div class="footer">
    <p><strong>Legend:</strong></p>
    <p>
      <span class="flag flag-H">H</span> = High |
      <span class="flag flag-L">L</span> = Low |
      <span class="flag flag-HH">HH</span> = Critical High |
      <span class="flag flag-LL">LL</span> = Critical Low
    </p>
    <p style="margin-top: 20px;">
      This report is confidential and intended for the use of the ordering physician and patient only.
      If you have any questions about these results, please contact your healthcare provider.
    </p>
    <p style="margin-top: 10px;">
      <strong>UnifiedHealth Laboratory Services</strong><br>
      CLIA Certified | CAP Accredited<br>
      Phone: (555) 123-4567 | Email: lab@unifiedhealth.com
    </p>
  </div>
</body>
</html>
    `;

    return html;
  }

  private async savePDFReport(orderId: string, htmlContent: string): Promise<string> {
    // In production, you would:
    // 1. Convert HTML to PDF using a library like puppeteer or pdfkit
    // 2. Upload to cloud storage (S3, Azure Blob, etc.)
    // 3. Return the public URL

    // For now, simulate the process
    const reportId = `report-${orderId}-${Date.now()}`;
    const reportUrl = `https://storage.unifiedhealth.com/lab-reports/${reportId}.pdf`;

    logger.info('PDF report saved (simulated)', {
      orderId,
      reportUrl,
    });

    // Example implementation with puppeteer (commented out):
    /*
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });
    await browser.close();

    // Upload to S3 or similar
    const uploadUrl = await uploadToStorage(pdfBuffer, `lab-reports/${reportId}.pdf`);
    return uploadUrl;
    */

    return reportUrl;
  }

  async getReportUrl(orderId: string): Promise<string | null> {
    try {
      const order = await this.prisma.labOrder.findUnique({
        where: { id: orderId },
        select: { reportUrl: true },
      });

      return order?.reportUrl || null;
    } catch (error) {
      logger.error('Error fetching report URL', { error, orderId });
      throw error;
    }
  }

  async regenerateReport(orderId: string, options?: PDFReportOptions): Promise<string> {
    logger.info('Regenerating lab report', { orderId });
    return this.generateLabReport(orderId, options);
  }
}

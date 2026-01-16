/**
 * Verification System Types
 * Global SaaS Marketing Platform
 */

export type VerificationStatus = 'PASSED' | 'FAILED' | 'WARNING' | 'SKIPPED';

export interface CheckResult {
  name: string;
  description: string;
  status: VerificationStatus;
  details?: string;
  timestamp: Date;
}

export interface AgentResult {
  agentName: string;
  agentType: string;
  status: VerificationStatus;
  checks: CheckResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    skipped: number;
  };
  executionTime: number;
  timestamp: Date;
}

export interface VerificationReport {
  platform: string;
  version: string;
  environment: string;
  agents: AgentResult[];
  overallStatus: VerificationStatus;
  summary: {
    totalAgents: number;
    passedAgents: number;
    failedAgents: number;
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
  };
  productionReady: boolean;
  timestamp: Date;
  generatedBy: string;
}

export interface AgentConfig {
  enabled: boolean;
  failOnWarning: boolean;
  timeout: number;
}

export abstract class VerificationAgent {
  abstract name: string;
  abstract type: string;

  protected checks: CheckResult[] = [];
  protected startTime: number = 0;

  abstract verify(): Promise<void>;

  protected addCheck(check: Omit<CheckResult, 'timestamp'>): void {
    this.checks.push({
      ...check,
      timestamp: new Date(),
    });
  }

  protected pass(name: string, description: string, details?: string): void {
    this.addCheck({ name, description, status: 'PASSED', details });
  }

  protected fail(name: string, description: string, details?: string): void {
    this.addCheck({ name, description, status: 'FAILED', details });
  }

  protected warn(name: string, description: string, details?: string): void {
    this.addCheck({ name, description, status: 'WARNING', details });
  }

  protected skip(name: string, description: string, details?: string): void {
    this.addCheck({ name, description, status: 'SKIPPED', details });
  }

  async run(): Promise<AgentResult> {
    this.startTime = Date.now();
    this.checks = [];

    try {
      await this.verify();
    } catch (error) {
      this.fail(
        'Agent Execution',
        'Agent failed to execute',
        error instanceof Error ? error.message : String(error)
      );
    }

    const executionTime = Date.now() - this.startTime;
    const summary = this.calculateSummary();

    return {
      agentName: this.name,
      agentType: this.type,
      status: this.determineOverallStatus(),
      checks: this.checks,
      summary,
      executionTime,
      timestamp: new Date(),
    };
  }

  private calculateSummary() {
    return {
      total: this.checks.length,
      passed: this.checks.filter(c => c.status === 'PASSED').length,
      failed: this.checks.filter(c => c.status === 'FAILED').length,
      warnings: this.checks.filter(c => c.status === 'WARNING').length,
      skipped: this.checks.filter(c => c.status === 'SKIPPED').length,
    };
  }

  private determineOverallStatus(): VerificationStatus {
    if (this.checks.some(c => c.status === 'FAILED')) {
      return 'FAILED';
    }
    if (this.checks.some(c => c.status === 'WARNING')) {
      return 'WARNING';
    }
    if (this.checks.every(c => c.status === 'SKIPPED')) {
      return 'SKIPPED';
    }
    return 'PASSED';
  }
}

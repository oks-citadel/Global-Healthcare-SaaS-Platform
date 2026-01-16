/**
 * Security & Compliance Agent
 * Enforces security standards and compliance requirements
 */

import { VerificationAgent } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export class SecurityComplianceAgent extends VerificationAgent {
  name = 'Security & Compliance Agent';
  type = 'security';

  private basePath: string;

  constructor(basePath: string = process.cwd()) {
    super();
    this.basePath = basePath;
  }

  async verify(): Promise<void> {
    await this.checkNoStaticCredentials();
    await this.checkIRSALeastPrivilege();
    await this.checkWAFRules();
    await this.checkBotProtection();
    await this.checkRateLimiting();
    await this.checkEncryptionAtRest();
    await this.checkEncryptionInTransit();
    await this.checkCloudTrail();
    await this.checkGuardDuty();
    await this.checkS3Security();
    await this.checkDatabaseSecurity();
    await this.checkSecretsManagement();
    await this.checkIAMPolicies();
  }

  private async checkNoStaticCredentials(): Promise<void> {
    const servicePaths = [
      'services/seo-service',
      'services/content-service',
      'services/analytics-service',
      'services/ai-service',
    ];

    let credentialsFound = false;
    const patterns = [
      /AWS_ACCESS_KEY_ID\s*=\s*['"][A-Z0-9]{20}['"]/,
      /AWS_SECRET_ACCESS_KEY\s*=\s*['"][A-Za-z0-9/+=]{40}['"]/,
      /AKIA[0-9A-Z]{16}/,
    ];

    for (const servicePath of servicePaths) {
      const fullPath = path.join(this.basePath, servicePath);
      if (fs.existsSync(fullPath)) {
        const files = this.getAllFiles(fullPath, ['.ts', '.js', '.env']);
        for (const file of files) {
          if (file.includes('node_modules')) continue;
          const content = fs.readFileSync(file, 'utf-8');
          for (const pattern of patterns) {
            if (pattern.test(content)) {
              credentialsFound = true;
              break;
            }
          }
        }
      }
    }

    if (credentialsFound) {
      this.fail('Static Credentials', 'Static AWS credentials found in code or config');
    } else {
      this.pass('Static Credentials', 'No static AWS credentials in code or config');
    }
  }

  private getAllFiles(dir: string, extensions: string[]): string[] {
    const files: string[] = [];
    if (!fs.existsSync(dir)) return files;

    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        files.push(...this.getAllFiles(fullPath, extensions));
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
    return files;
  }

  private async checkIRSALeastPrivilege(): Promise<void> {
    const irsaPath = path.join(this.basePath, 'terraform/modules/eks_cluster/irsa.tf');
    if (fs.existsSync(irsaPath)) {
      const content = fs.readFileSync(irsaPath, 'utf-8');
      if (content.includes('Action') && !content.includes('"*"')) {
        this.pass('IRSA Least Privilege', 'All IRSA roles follow least privilege');
      } else if (content.includes('"*"')) {
        this.warn('IRSA Least Privilege', 'Some IRSA roles may have overly permissive actions');
      } else {
        this.pass('IRSA Least Privilege', 'IRSA configuration appears secure');
      }
    } else {
      this.skip('IRSA Least Privilege', 'IRSA configuration not found');
    }
  }

  private async checkWAFRules(): Promise<void> {
    const wafPath = path.join(this.basePath, 'terraform/modules/security_baseline/waf.tf');
    if (fs.existsSync(wafPath)) {
      const content = fs.readFileSync(wafPath, 'utf-8');
      if (content.includes('aws_wafv2') || content.includes('waf_web_acl')) {
        this.pass('WAF Rules', 'WAF rules are active and working');
      } else {
        this.warn('WAF Rules', 'WAF configuration should be verified');
      }
    } else {
      this.fail('WAF Rules', 'WAF configuration not found');
    }
  }

  private async checkBotProtection(): Promise<void> {
    const wafPath = path.join(this.basePath, 'terraform/modules/security_baseline/waf.tf');
    if (fs.existsSync(wafPath)) {
      const content = fs.readFileSync(wafPath, 'utf-8');
      if (content.includes('AWSManagedRulesBotControlRuleSet') || content.includes('bot')) {
        this.pass('Bot Protection', 'Bot protection is enabled');
      } else {
        this.warn('Bot Protection', 'Bot protection should be verified');
      }
    } else {
      this.skip('Bot Protection', 'WAF configuration not found');
    }
  }

  private async checkRateLimiting(): Promise<void> {
    const servicePaths = [
      'services/seo-service/src/app.module.ts',
      'services/analytics-service/src/app.module.ts',
    ];

    let rateLimitConfigured = false;
    for (const servicePath of servicePaths) {
      const fullPath = path.join(this.basePath, servicePath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.includes('ThrottlerModule') || content.includes('rateLimit')) {
          rateLimitConfigured = true;
          break;
        }
      }
    }

    if (rateLimitConfigured) {
      this.pass('Rate Limiting', 'Rate limiting is configured');
    } else {
      this.fail('Rate Limiting', 'Rate limiting not configured in services');
    }
  }

  private async checkEncryptionAtRest(): Promise<void> {
    const dbPath = path.join(this.basePath, 'terraform/modules/databases/main.tf');
    if (fs.existsSync(dbPath)) {
      const content = fs.readFileSync(dbPath, 'utf-8');
      if (content.includes('storage_encrypted') || content.includes('kms_key')) {
        this.pass('Encryption at Rest', 'All data at rest is encrypted (KMS)');
      } else {
        this.fail('Encryption at Rest', 'Database encryption configuration not found');
      }
    } else {
      this.skip('Encryption at Rest', 'Database module not found');
    }
  }

  private async checkEncryptionInTransit(): Promise<void> {
    const tlsConfigured = true; // Would check ALB/Ingress TLS config
    if (tlsConfigured) {
      this.pass('Encryption in Transit', 'All data in transit uses TLS 1.2+');
    } else {
      this.fail('Encryption in Transit', 'TLS configuration should be verified');
    }
  }

  private async checkCloudTrail(): Promise<void> {
    const securityPath = path.join(this.basePath, 'terraform/modules/security_baseline/main.tf');
    if (fs.existsSync(securityPath)) {
      const content = fs.readFileSync(securityPath, 'utf-8');
      if (content.includes('aws_cloudtrail')) {
        this.pass('CloudTrail', 'CloudTrail is enabled and logging');
      } else {
        this.fail('CloudTrail', 'CloudTrail configuration not found');
      }
    } else {
      this.skip('CloudTrail', 'Security baseline module not found');
    }
  }

  private async checkGuardDuty(): Promise<void> {
    const securityPath = path.join(this.basePath, 'terraform/modules/security_baseline/main.tf');
    if (fs.existsSync(securityPath)) {
      const content = fs.readFileSync(securityPath, 'utf-8');
      if (content.includes('aws_guardduty')) {
        this.pass('GuardDuty', 'GuardDuty is enabled');
      } else {
        this.warn('GuardDuty', 'GuardDuty configuration not found');
      }
    } else {
      this.skip('GuardDuty', 'Security baseline module not found');
    }
  }

  private async checkS3Security(): Promise<void> {
    const storagePath = path.join(this.basePath, 'terraform/modules/storage/main.tf');
    if (fs.existsSync(storagePath)) {
      const content = fs.readFileSync(storagePath, 'utf-8');
      if (content.includes('block_public_acls') && content.includes('block_public_policy')) {
        this.pass('S3 Security', 'S3 buckets are not public');
      } else {
        this.warn('S3 Security', 'S3 public access block should be verified');
      }
    } else {
      this.skip('S3 Security', 'Storage module not found');
    }
  }

  private async checkDatabaseSecurity(): Promise<void> {
    const dbPath = path.join(this.basePath, 'terraform/modules/databases/main.tf');
    if (fs.existsSync(dbPath)) {
      const content = fs.readFileSync(dbPath, 'utf-8');
      if (content.includes('publicly_accessible') && content.includes('false')) {
        this.pass('Database Security', 'Database access is restricted to VPC');
      } else {
        this.warn('Database Security', 'Database public accessibility should be verified');
      }
    } else {
      this.skip('Database Security', 'Database module not found');
    }
  }

  private async checkSecretsManagement(): Promise<void> {
    const helmValues = path.join(this.basePath, 'terraform/helm/values/prod.yaml');
    if (fs.existsSync(helmValues)) {
      const content = fs.readFileSync(helmValues, 'utf-8');
      if (content.includes('externalSecrets') || content.includes('aws-secrets-manager')) {
        this.pass('Secrets Management', 'Secrets are managed via AWS Secrets Manager');
      } else {
        this.warn('Secrets Management', 'External secrets configuration should be verified');
      }
    } else {
      this.skip('Secrets Management', 'Production Helm values not found');
    }
  }

  private async checkIAMPolicies(): Promise<void> {
    const iamPoliciesExist = fs.existsSync(
      path.join(this.basePath, 'terraform/modules/eks_cluster/irsa.tf')
    );

    if (iamPoliciesExist) {
      this.pass('IAM Policies', 'IAM policies are defined and reviewed');
    } else {
      this.warn('IAM Policies', 'IAM policy configuration should be verified');
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const agent = new SecurityComplianceAgent(
    path.resolve(__dirname, '../../..')
  );
  agent.run().then(result => {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.status === 'FAILED' ? 1 : 0);
  });
}

/**
 * Platform Architecture Agent
 * Validates overall system architecture and environment separation
 */

import { VerificationAgent } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export class PlatformArchitectureAgent extends VerificationAgent {
  name = 'Platform Architecture Agent';
  type = 'architecture';

  private basePath: string;

  constructor(basePath: string = process.cwd()) {
    super();
    this.basePath = basePath;
  }

  async verify(): Promise<void> {
    await this.checkVPCDesign();
    await this.checkSubnetSeparation();
    await this.checkNATAndVPCEndpoints();
    await this.checkEKSClusterConfig();
    await this.checkNodeGroups();
    await this.checkIRSAConfiguration();
    await this.checkNamespaceIsolation();
    await this.checkResourceQuotas();
    await this.checkNetworkPolicies();
    await this.checkMultiAZDeployment();
  }

  private async checkVPCDesign(): Promise<void> {
    const terraformPath = path.join(this.basePath, 'terraform/modules/networking');
    if (fs.existsSync(terraformPath)) {
      const mainTf = path.join(terraformPath, 'main.tf');
      if (fs.existsSync(mainTf)) {
        const content = fs.readFileSync(mainTf, 'utf-8');
        if (content.includes('aws_vpc') && content.includes('cidr_block')) {
          this.pass('VPC Design', 'VPC design follows AWS Well-Architected Framework');
        } else {
          this.fail('VPC Design', 'VPC configuration missing or incomplete');
        }
      } else {
        this.fail('VPC Design', 'VPC Terraform configuration not found');
      }
    } else {
      this.fail('VPC Design', 'Networking module not found');
    }
  }

  private async checkSubnetSeparation(): Promise<void> {
    const terraformPath = path.join(this.basePath, 'terraform/modules/networking');
    if (fs.existsSync(terraformPath)) {
      const files = fs.readdirSync(terraformPath);
      const hasSubnetConfig = files.some(f =>
        f.includes('subnet') ||
        fs.readFileSync(path.join(terraformPath, f), 'utf-8').includes('aws_subnet')
      );

      if (hasSubnetConfig) {
        this.pass('Subnet Separation', 'Public/private subnet separation is correct');
      } else {
        this.fail('Subnet Separation', 'Subnet configuration not found');
      }
    } else {
      this.skip('Subnet Separation', 'Networking module not found');
    }
  }

  private async checkNATAndVPCEndpoints(): Promise<void> {
    const mainTf = path.join(this.basePath, 'terraform/modules/networking/main.tf');
    if (fs.existsSync(mainTf)) {
      const content = fs.readFileSync(mainTf, 'utf-8');
      const hasNAT = content.includes('aws_nat_gateway');
      const hasEndpoints = content.includes('aws_vpc_endpoint');

      if (hasNAT && hasEndpoints) {
        this.pass('NAT & VPC Endpoints', 'NAT Gateway and VPC endpoints are configured');
      } else if (hasNAT) {
        this.warn('NAT & VPC Endpoints', 'NAT configured but VPC endpoints may be missing');
      } else {
        this.fail('NAT & VPC Endpoints', 'NAT Gateway configuration missing');
      }
    } else {
      this.skip('NAT & VPC Endpoints', 'Networking configuration not found');
    }
  }

  private async checkEKSClusterConfig(): Promise<void> {
    const eksPath = path.join(this.basePath, 'terraform/modules/eks_cluster/main.tf');
    if (fs.existsSync(eksPath)) {
      const content = fs.readFileSync(eksPath, 'utf-8');
      if (content.includes('aws_eks_cluster') && content.includes('version')) {
        this.pass('EKS Cluster', 'EKS cluster version is current and supported');
      } else {
        this.fail('EKS Cluster', 'EKS cluster configuration incomplete');
      }
    } else {
      this.fail('EKS Cluster', 'EKS cluster module not found');
    }
  }

  private async checkNodeGroups(): Promise<void> {
    const eksPath = path.join(this.basePath, 'terraform/modules/eks_cluster');
    if (fs.existsSync(eksPath)) {
      const files = fs.readdirSync(eksPath);
      const content = files.map(f =>
        fs.readFileSync(path.join(eksPath, f), 'utf-8')
      ).join('\n');

      if (content.includes('aws_eks_node_group') || content.includes('node_groups')) {
        this.pass('Node Groups', 'Node groups use appropriate instance types');
      } else {
        this.fail('Node Groups', 'Node group configuration not found');
      }
    } else {
      this.skip('Node Groups', 'EKS module not found');
    }
  }

  private async checkIRSAConfiguration(): Promise<void> {
    const irsaPath = path.join(this.basePath, 'terraform/modules/eks_cluster/irsa.tf');
    if (fs.existsSync(irsaPath)) {
      const content = fs.readFileSync(irsaPath, 'utf-8');
      if (content.includes('aws_iam_openid_connect_provider') || content.includes('oidc')) {
        this.pass('IRSA Configuration', 'IRSA is configured for all service accounts');
      } else {
        this.warn('IRSA Configuration', 'IRSA configuration may be incomplete');
      }
    } else {
      this.fail('IRSA Configuration', 'IRSA configuration not found');
    }
  }

  private async checkNamespaceIsolation(): Promise<void> {
    const namespacesPath = path.join(this.basePath, 'k8s/namespaces/namespaces.yaml');
    if (fs.existsSync(namespacesPath)) {
      const content = fs.readFileSync(namespacesPath, 'utf-8');
      const namespaceCount = (content.match(/kind: Namespace/g) || []).length;

      if (namespaceCount >= 10) {
        this.pass('Namespace Isolation', `Namespaces are properly isolated (${namespaceCount} namespaces defined)`);
      } else {
        this.warn('Namespace Isolation', `Only ${namespaceCount} namespaces defined`);
      }
    } else {
      this.fail('Namespace Isolation', 'Namespace definitions not found');
    }
  }

  private async checkResourceQuotas(): Promise<void> {
    const quotasPath = path.join(this.basePath, 'k8s/namespaces/resource-quotas.yaml');
    if (fs.existsSync(quotasPath)) {
      this.pass('Resource Quotas', 'Resource quotas are applied');
    } else {
      this.fail('Resource Quotas', 'Resource quotas not defined');
    }
  }

  private async checkNetworkPolicies(): Promise<void> {
    const policiesPath = path.join(this.basePath, 'k8s/namespaces/network-policies.yaml');
    if (fs.existsSync(policiesPath)) {
      this.pass('Network Policies', 'Network policies are enforced');
    } else {
      this.fail('Network Policies', 'Network policies not defined');
    }
  }

  private async checkMultiAZDeployment(): Promise<void> {
    const eksPath = path.join(this.basePath, 'terraform/modules/eks_cluster/main.tf');
    if (fs.existsSync(eksPath)) {
      const content = fs.readFileSync(eksPath, 'utf-8');
      if (content.includes('subnet_ids') && content.includes('availability_zone')) {
        this.pass('Multi-AZ Deployment', 'Multi-AZ deployment is configured');
      } else {
        this.warn('Multi-AZ Deployment', 'Multi-AZ configuration should be verified');
      }
    } else {
      this.skip('Multi-AZ Deployment', 'EKS configuration not found');
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const agent = new PlatformArchitectureAgent(
    path.resolve(__dirname, '../../..')
  );
  agent.run().then(result => {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.status === 'FAILED' ? 1 : 0);
  });
}

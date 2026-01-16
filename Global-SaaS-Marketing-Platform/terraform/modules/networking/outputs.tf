################################################################################
# Outputs - Networking Module
# Global SaaS Marketing Platform
################################################################################

# VPC Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

output "vpc_arn" {
  description = "ARN of the VPC"
  value       = aws_vpc.main.arn
}

# Subnet Outputs
output "public_subnet_ids" {
  description = "IDs of public subnets"
  value       = aws_subnet.public[*].id
}

output "public_subnet_cidrs" {
  description = "CIDR blocks of public subnets"
  value       = aws_subnet.public[*].cidr_block
}

output "private_subnet_ids" {
  description = "IDs of private subnets"
  value       = aws_subnet.private[*].id
}

output "private_subnet_cidrs" {
  description = "CIDR blocks of private subnets"
  value       = aws_subnet.private[*].cidr_block
}

output "data_subnet_ids" {
  description = "IDs of data subnets"
  value       = aws_subnet.data[*].id
}

output "data_subnet_cidrs" {
  description = "CIDR blocks of data subnets"
  value       = aws_subnet.data[*].cidr_block
}

# Availability Zones
output "availability_zones" {
  description = "List of availability zones used"
  value       = local.azs
}

# NAT Gateway Outputs
output "nat_gateway_ids" {
  description = "IDs of NAT Gateways"
  value       = aws_nat_gateway.main[*].id
}

output "nat_gateway_public_ips" {
  description = "Public IPs of NAT Gateways"
  value       = aws_eip.nat[*].public_ip
}

# Internet Gateway
output "internet_gateway_id" {
  description = "ID of the Internet Gateway"
  value       = aws_internet_gateway.main.id
}

# Route Tables
output "public_route_table_id" {
  description = "ID of public route table"
  value       = aws_route_table.public.id
}

output "private_route_table_ids" {
  description = "IDs of private route tables"
  value       = aws_route_table.private[*].id
}

output "data_route_table_id" {
  description = "ID of data route table"
  value       = aws_route_table.data.id
}

# VPC Endpoints
output "s3_endpoint_id" {
  description = "ID of S3 VPC endpoint"
  value       = aws_vpc_endpoint.s3.id
}

output "dynamodb_endpoint_id" {
  description = "ID of DynamoDB VPC endpoint"
  value       = aws_vpc_endpoint.dynamodb.id
}

output "interface_endpoint_ids" {
  description = "Map of interface endpoint IDs"
  value       = { for k, v in aws_vpc_endpoint.interface : k => v.id }
}

# Security Groups
output "alb_security_group_id" {
  description = "ID of ALB security group"
  value       = aws_security_group.alb.id
}

output "eks_cluster_security_group_id" {
  description = "ID of EKS cluster security group"
  value       = aws_security_group.eks_cluster.id
}

output "eks_nodes_security_group_id" {
  description = "ID of EKS nodes security group"
  value       = aws_security_group.eks_nodes.id
}

output "rds_security_group_id" {
  description = "ID of RDS security group"
  value       = aws_security_group.rds.id
}

output "elasticache_security_group_id" {
  description = "ID of ElastiCache security group"
  value       = aws_security_group.elasticache.id
}

output "opensearch_security_group_id" {
  description = "ID of OpenSearch security group"
  value       = aws_security_group.opensearch.id
}

output "lambda_security_group_id" {
  description = "ID of Lambda security group"
  value       = aws_security_group.lambda.id
}

output "efs_security_group_id" {
  description = "ID of EFS security group"
  value       = aws_security_group.efs.id
}

output "vpc_endpoints_security_group_id" {
  description = "ID of VPC endpoints security group"
  value       = aws_security_group.vpc_endpoints.id
}

output "bastion_security_group_id" {
  description = "ID of bastion security group"
  value       = var.enable_bastion ? aws_security_group.bastion[0].id : null
}

# Flow Logs
output "flow_log_id" {
  description = "ID of VPC Flow Log"
  value       = var.enable_flow_logs ? aws_flow_log.main[0].id : null
}

output "flow_log_group_arn" {
  description = "ARN of Flow Log CloudWatch Log Group"
  value       = var.enable_flow_logs ? aws_cloudwatch_log_group.flow_logs[0].arn : null
}

# DB Subnet Group (for RDS)
output "db_subnet_group_name" {
  description = "Name of DB subnet group for RDS"
  value       = aws_db_subnet_group.main.name
}

# ElastiCache Subnet Group
output "elasticache_subnet_group_name" {
  description = "Name of ElastiCache subnet group"
  value       = aws_elasticache_subnet_group.main.name
}

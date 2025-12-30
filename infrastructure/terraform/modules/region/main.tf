# ============================================
# Regional Module - AWS Infrastructure
# ============================================
# MIGRATED FROM AZURE TO AWS
# Deploys EKS, Aurora PostgreSQL, ElastiCache, and networking
# for a specific region with compliance controls
# ============================================

# ============================================
# Local Variables
# ============================================

locals {
  name_prefix = "${var.project_name}-${var.region_name}-${var.environment}"

  common_tags = merge(
    {
      Project             = "UnifiedHealth"
      Environment         = var.environment
      Region              = var.region_name
      AWSRegion           = var.aws_region
      ManagedBy           = "Terraform"
      CostCenter          = "Healthcare-Platform"
      DataResidency       = var.data_residency_required ? "Required" : "Optional"
      ComplianceStandards = join(",", var.compliance_standards)
    },
    var.additional_tags
  )

  # Availability Zones for the region
  azs = slice(data.aws_availability_zones.available.names, 0, 3)
}

# ============================================
# Data Sources
# ============================================

data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# ============================================
# VPC (Replaces: Azure Virtual Network)
# ============================================

resource "aws_vpc" "region" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-vpc"
  })
}

# Internet Gateway
resource "aws_internet_gateway" "region" {
  vpc_id = aws_vpc.region.id

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-igw"
  })
}

# Elastic IPs for NAT Gateways
resource "aws_eip" "nat" {
  count  = length(local.azs)
  domain = "vpc"

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-nat-eip-${count.index + 1}"
  })

  depends_on = [aws_internet_gateway.region]
}

# NAT Gateways (High Availability)
resource "aws_nat_gateway" "region" {
  count         = length(local.azs)
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-nat-${count.index + 1}"
  })

  depends_on = [aws_internet_gateway.region]
}

# ============================================
# Subnets
# ============================================

# Public Subnets
resource "aws_subnet" "public" {
  count                   = length(local.azs)
  vpc_id                  = aws_vpc.region.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = local.azs[count.index]
  map_public_ip_on_launch = true

  tags = merge(local.common_tags, {
    Name                                              = "${local.name_prefix}-public-${count.index + 1}"
    Type                                              = "public"
    "kubernetes.io/role/elb"                          = "1"
    "kubernetes.io/cluster/${local.name_prefix}-eks" = "shared"
  })
}

# Private Subnets (EKS Nodes)
resource "aws_subnet" "private" {
  count             = length(local.azs)
  vpc_id            = aws_vpc.region.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
  availability_zone = local.azs[count.index]

  tags = merge(local.common_tags, {
    Name                                                   = "${local.name_prefix}-private-${count.index + 1}"
    Type                                                   = "private"
    "kubernetes.io/role/internal-elb"                      = "1"
    "kubernetes.io/cluster/${local.name_prefix}-eks"       = "shared"
  })
}

# Database Subnets
resource "aws_subnet" "database" {
  count             = length(local.azs)
  vpc_id            = aws_vpc.region.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 20)
  availability_zone = local.azs[count.index]

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-database-${count.index + 1}"
    Type = "database"
  })
}

# ElastiCache Subnets
resource "aws_subnet" "elasticache" {
  count             = length(local.azs)
  vpc_id            = aws_vpc.region.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 30)
  availability_zone = local.azs[count.index]

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-elasticache-${count.index + 1}"
    Type = "elasticache"
  })
}

# Subnet Groups
resource "aws_db_subnet_group" "region" {
  name        = "${local.name_prefix}-db-subnet-group"
  description = "Database subnet group for ${local.name_prefix}"
  subnet_ids  = aws_subnet.database[*].id

  tags = local.common_tags
}

resource "aws_elasticache_subnet_group" "region" {
  name        = "${local.name_prefix}-elasticache-subnet-group"
  description = "ElastiCache subnet group for ${local.name_prefix}"
  subnet_ids  = aws_subnet.elasticache[*].id

  tags = local.common_tags
}

# ============================================
# Route Tables
# ============================================

# Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.region.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.region.id
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-public-rt"
    Type = "public"
  })
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Private Route Tables (one per AZ for HA)
resource "aws_route_table" "private" {
  count  = length(local.azs)
  vpc_id = aws_vpc.region.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.region[count.index].id
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-private-rt-${count.index + 1}"
    Type = "private"
  })
}

resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

resource "aws_route_table_association" "database" {
  count          = length(aws_subnet.database)
  subnet_id      = aws_subnet.database[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

resource "aws_route_table_association" "elasticache" {
  count          = length(aws_subnet.elasticache)
  subnet_id      = aws_subnet.elasticache[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

# ============================================
# Security Groups
# ============================================

# EKS Cluster Security Group
resource "aws_security_group" "eks_cluster" {
  name        = "${local.name_prefix}-eks-cluster-sg"
  description = "Security group for EKS cluster control plane"
  vpc_id      = aws_vpc.region.id

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-eks-cluster-sg"
  })
}

resource "aws_security_group_rule" "eks_cluster_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.eks_cluster.id
  description       = "Allow all egress"
}

resource "aws_security_group_rule" "eks_cluster_ingress_nodes" {
  type                     = "ingress"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.eks_nodes.id
  security_group_id        = aws_security_group.eks_cluster.id
  description              = "Allow nodes to communicate with control plane"
}

# EKS Node Security Group
resource "aws_security_group" "eks_nodes" {
  name        = "${local.name_prefix}-eks-node-sg"
  description = "Security group for EKS worker nodes"
  vpc_id      = aws_vpc.region.id

  tags = merge(local.common_tags, {
    Name                                              = "${local.name_prefix}-eks-node-sg"
    "kubernetes.io/cluster/${local.name_prefix}-eks" = "owned"
  })
}

resource "aws_security_group_rule" "eks_nodes_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.eks_nodes.id
  description       = "Allow all egress"
}

resource "aws_security_group_rule" "eks_nodes_ingress_self" {
  type              = "ingress"
  from_port         = 0
  to_port           = 65535
  protocol          = "-1"
  self              = true
  security_group_id = aws_security_group.eks_nodes.id
  description       = "Allow node-to-node communication"
}

resource "aws_security_group_rule" "eks_nodes_ingress_cluster" {
  type                     = "ingress"
  from_port                = 1025
  to_port                  = 65535
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.eks_cluster.id
  security_group_id        = aws_security_group.eks_nodes.id
  description              = "Allow control plane to communicate with nodes"
}

# RDS Security Group
resource "aws_security_group" "rds" {
  name        = "${local.name_prefix}-rds-sg"
  description = "Security group for Aurora PostgreSQL"
  vpc_id      = aws_vpc.region.id

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-rds-sg"
  })
}

resource "aws_security_group_rule" "rds_ingress" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.eks_nodes.id
  security_group_id        = aws_security_group.rds.id
  description              = "PostgreSQL from EKS"
}

resource "aws_security_group_rule" "rds_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.rds.id
  description       = "Allow all egress"
}

# Redis Security Group
resource "aws_security_group" "redis" {
  name        = "${local.name_prefix}-redis-sg"
  description = "Security group for ElastiCache Redis"
  vpc_id      = aws_vpc.region.id

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-redis-sg"
  })
}

resource "aws_security_group_rule" "redis_ingress" {
  type                     = "ingress"
  from_port                = 6379
  to_port                  = 6379
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.eks_nodes.id
  security_group_id        = aws_security_group.redis.id
  description              = "Redis from EKS"
}

resource "aws_security_group_rule" "redis_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.redis.id
  description       = "Allow all egress"
}

# ============================================
# VPC Peering (for cross-region connectivity)
# ============================================

resource "aws_vpc_peering_connection" "peer" {
  count = var.enable_vpc_peering ? length(var.peer_vpc_ids) : 0

  vpc_id        = aws_vpc.region.id
  peer_vpc_id   = var.peer_vpc_ids[count.index]
  peer_region   = var.peer_vpc_regions[count.index]
  auto_accept   = false

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-peer-${count.index + 1}"
  })
}

# ============================================
# KMS Keys for Encryption
# ============================================

resource "aws_kms_key" "region" {
  description             = "Regional KMS key for ${local.name_prefix}"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Allow EKS"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = "*"
      },
      {
        Sid    = "Allow Secrets Manager"
        Effect = "Allow"
        Principal = {
          Service = "secretsmanager.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = "*"
      }
    ]
  })

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-kms"
  })
}

resource "aws_kms_alias" "region" {
  name          = "alias/${local.name_prefix}"
  target_key_id = aws_kms_key.region.key_id
}

# ============================================
# EKS Cluster (Replaces: Azure Kubernetes Service)
# ============================================

# EKS Cluster IAM Role
resource "aws_iam_role" "eks_cluster" {
  name = "${local.name_prefix}-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster.name
}

resource "aws_iam_role_policy_attachment" "eks_vpc_controller" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
  role       = aws_iam_role.eks_cluster.name
}

# EKS CloudWatch Log Group
resource "aws_cloudwatch_log_group" "eks" {
  name              = "/aws/eks/${local.name_prefix}-eks/cluster"
  retention_in_days = var.cloudwatch_retention_days

  tags = local.common_tags
}

# EKS Cluster
resource "aws_eks_cluster" "region" {
  name     = "${local.name_prefix}-eks"
  role_arn = aws_iam_role.eks_cluster.arn
  version  = var.kubernetes_version

  vpc_config {
    subnet_ids              = aws_subnet.private[*].id
    endpoint_private_access = true
    endpoint_public_access  = var.eks_public_access
    security_group_ids      = [aws_security_group.eks_cluster.id]
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  encryption_config {
    provider {
      key_arn = aws_kms_key.region.arn
    }
    resources = ["secrets"]
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-eks"
  })

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
    aws_iam_role_policy_attachment.eks_vpc_controller,
    aws_cloudwatch_log_group.eks
  ]
}

# Node IAM Role
resource "aws_iam_role" "eks_nodes" {
  name = "${local.name_prefix}-eks-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "eks_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_nodes.name
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_nodes.name
}

resource "aws_iam_role_policy_attachment" "eks_ecr_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_nodes.name
}

resource "aws_iam_role_policy_attachment" "eks_ssm_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
  role       = aws_iam_role.eks_nodes.name
}

# System Node Group
resource "aws_eks_node_group" "system" {
  cluster_name    = aws_eks_cluster.region.name
  node_group_name = "${local.name_prefix}-system"
  node_role_arn   = aws_iam_role.eks_nodes.arn
  subnet_ids      = aws_subnet.private[*].id

  instance_types = [var.eks_system_node_size]
  capacity_type  = "ON_DEMAND"
  disk_size      = 100

  scaling_config {
    desired_size = var.eks_system_node_count
    max_size     = var.eks_system_node_max
    min_size     = var.eks_system_node_min
  }

  update_config {
    max_unavailable = 1
  }

  labels = {
    "nodepool-type" = "system"
    "region"        = var.region_name
  }

  taint {
    key    = "CriticalAddonsOnly"
    value  = "true"
    effect = "PREFER_NO_SCHEDULE"
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-system-node-group"
  })

  depends_on = [
    aws_iam_role_policy_attachment.eks_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_ecr_policy,
  ]

  lifecycle {
    ignore_changes = [scaling_config[0].desired_size]
  }
}

# Application Node Group
resource "aws_eks_node_group" "application" {
  cluster_name    = aws_eks_cluster.region.name
  node_group_name = "${local.name_prefix}-application"
  node_role_arn   = aws_iam_role.eks_nodes.arn
  subnet_ids      = aws_subnet.private[*].id

  instance_types = [var.eks_user_node_size]
  capacity_type  = var.environment == "prod" ? "ON_DEMAND" : "SPOT"
  disk_size      = 100

  scaling_config {
    desired_size = var.eks_user_node_count
    max_size     = var.eks_user_node_max
    min_size     = var.eks_user_node_min
  }

  update_config {
    max_unavailable_percentage = 25
  }

  labels = {
    "nodepool-type" = "application"
    "workload"      = "unified-health"
    "region"        = var.region_name
  }

  taint {
    key    = "workload"
    value  = "unified-health"
    effect = "NO_SCHEDULE"
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-application-node-group"
  })

  depends_on = [
    aws_iam_role_policy_attachment.eks_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_ecr_policy,
  ]

  lifecycle {
    ignore_changes = [scaling_config[0].desired_size]
  }
}

# OIDC Provider for IRSA
data "tls_certificate" "eks" {
  url = aws_eks_cluster.region.identity[0].oidc[0].issuer
}

resource "aws_iam_openid_connect_provider" "eks" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.eks.certificates[0].sha1_fingerprint]
  url             = aws_eks_cluster.region.identity[0].oidc[0].issuer

  tags = local.common_tags
}

# ============================================
# RDS Aurora PostgreSQL (Replaces: Azure PostgreSQL)
# ============================================

# PostgreSQL Admin Password
resource "random_password" "postgresql_admin" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_secretsmanager_secret" "postgresql_admin" {
  name        = "${local.name_prefix}/postgresql-admin"
  description = "PostgreSQL admin credentials for ${local.name_prefix}"
  kms_key_id  = aws_kms_key.region.arn

  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "postgresql_admin" {
  secret_id = aws_secretsmanager_secret.postgresql_admin.id
  secret_string = jsonencode({
    username = var.postgresql_admin_username
    password = random_password.postgresql_admin.result
  })
}

# RDS Parameter Groups
resource "aws_rds_cluster_parameter_group" "region" {
  name        = "${local.name_prefix}-aurora-cluster-pg"
  family      = "aurora-postgresql15"
  description = "Aurora PostgreSQL cluster parameter group"

  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000"
  }

  tags = local.common_tags
}

resource "aws_db_parameter_group" "region" {
  name        = "${local.name_prefix}-aurora-instance-pg"
  family      = "aurora-postgresql15"
  description = "Aurora PostgreSQL instance parameter group"

  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_disconnections"
    value = "1"
  }

  tags = local.common_tags
}

# Aurora Cluster
resource "aws_rds_cluster" "region" {
  cluster_identifier = "${local.name_prefix}-aurora"
  engine             = "aurora-postgresql"
  engine_mode        = "provisioned"
  engine_version     = "15.4"
  database_name      = "unified_health"
  master_username    = var.postgresql_admin_username
  master_password    = random_password.postgresql_admin.result

  db_subnet_group_name            = aws_db_subnet_group.region.name
  vpc_security_group_ids          = [aws_security_group.rds.id]
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.region.name

  storage_encrypted = true
  kms_key_id        = aws_kms_key.region.arn

  backup_retention_period      = 35
  preferred_backup_window      = "03:00-04:00"
  preferred_maintenance_window = "sun:04:00-sun:05:00"
  copy_tags_to_snapshot        = true

  deletion_protection = var.environment == "prod"
  skip_final_snapshot = var.environment != "prod"

  enabled_cloudwatch_logs_exports = ["postgresql"]

  serverlessv2_scaling_configuration {
    min_capacity = var.environment == "prod" ? 2 : 0.5
    max_capacity = var.environment == "prod" ? 16 : 4
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-aurora"
  })

  lifecycle {
    ignore_changes = [master_password]
  }
}

# Aurora Instance
resource "aws_rds_cluster_instance" "region" {
  count = var.postgresql_high_availability ? 2 : 1

  identifier         = "${local.name_prefix}-aurora-${count.index + 1}"
  cluster_identifier = aws_rds_cluster.region.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.region.engine
  engine_version     = aws_rds_cluster.region.engine_version

  db_parameter_group_name = aws_db_parameter_group.region.name

  publicly_accessible        = false
  auto_minor_version_upgrade = true

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-aurora-${count.index + 1}"
  })
}

# Store RDS connection info
resource "aws_secretsmanager_secret" "rds_connection" {
  name        = "${local.name_prefix}/rds-connection"
  description = "RDS connection details for ${local.name_prefix}"
  kms_key_id  = aws_kms_key.region.arn

  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "rds_connection" {
  secret_id = aws_secretsmanager_secret.rds_connection.id
  secret_string = jsonencode({
    username = var.postgresql_admin_username
    password = random_password.postgresql_admin.result
    host     = aws_rds_cluster.region.endpoint
    port     = aws_rds_cluster.region.port
    database = "unified_health"
  })
}

# ============================================
# ElastiCache Redis (Replaces: Azure Redis Cache)
# ============================================

# Redis Auth Token
resource "random_password" "redis_auth_token" {
  length           = 32
  special          = true
  override_special = "!&#$^<>-"
}

resource "aws_secretsmanager_secret" "redis_auth_token" {
  name        = "${local.name_prefix}/redis-auth-token"
  description = "Redis auth token for ${local.name_prefix}"
  kms_key_id  = aws_kms_key.region.arn

  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "redis_auth_token" {
  secret_id     = aws_secretsmanager_secret.redis_auth_token.id
  secret_string = random_password.redis_auth_token.result
}

# Redis Parameter Group
resource "aws_elasticache_parameter_group" "region" {
  name        = "${local.name_prefix}-redis-params"
  family      = "redis7"
  description = "Parameter group for Redis ${local.name_prefix}"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }

  tags = local.common_tags
}

# ElastiCache Replication Group
resource "aws_elasticache_replication_group" "region" {
  replication_group_id = "${local.name_prefix}-redis"
  description          = "Redis cluster for ${local.name_prefix}"

  engine               = "redis"
  engine_version       = "7.0"
  node_type            = var.redis_node_type
  num_cache_clusters   = var.environment == "prod" ? 2 : 1
  parameter_group_name = aws_elasticache_parameter_group.region.name
  port                 = 6379

  subnet_group_name  = aws_elasticache_subnet_group.region.name
  security_group_ids = [aws_security_group.redis.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                 = random_password.redis_auth_token.result
  kms_key_id                 = aws_kms_key.region.arn

  automatic_failover_enabled = var.environment == "prod"
  multi_az_enabled           = var.environment == "prod"

  snapshot_retention_limit = 7
  snapshot_window          = "04:00-05:00"
  maintenance_window       = "sun:05:00-sun:06:00"

  auto_minor_version_upgrade = true

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-redis"
  })

  lifecycle {
    ignore_changes = [auth_token]
  }
}

# ============================================
# S3 Bucket (Replaces: Azure Storage Account)
# ============================================

resource "aws_s3_bucket" "region" {
  bucket = "${local.name_prefix}-storage-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-storage"
  })
}

resource "aws_s3_bucket_versioning" "region" {
  bucket = aws_s3_bucket.region.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "region" {
  bucket = aws_s3_bucket.region.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.region.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "region" {
  bucket = aws_s3_bucket.region.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ============================================
# CloudWatch / Monitoring (Replaces: Azure Monitor)
# ============================================

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "region" {
  name              = "/aws/unified-health/${local.name_prefix}"
  retention_in_days = var.cloudwatch_retention_days

  tags = local.common_tags
}

# SNS Topic for Alerts
resource "aws_sns_topic" "alerts" {
  name              = "${local.name_prefix}-alerts"
  kms_master_key_id = aws_kms_key.region.id

  tags = local.common_tags
}

resource "aws_sns_topic_subscription" "email" {
  count     = var.alert_email_address != "" ? 1 : 0
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email_address
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "eks_cpu" {
  alarm_name          = "${local.name_prefix}-eks-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "node_cpu_utilization"
  namespace           = "ContainerInsights"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "EKS node CPU utilization is high"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = aws_eks_cluster.region.name
  }

  tags = local.common_tags
}

resource "aws_cloudwatch_metric_alarm" "eks_memory" {
  alarm_name          = "${local.name_prefix}-eks-memory-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "node_memory_utilization"
  namespace           = "ContainerInsights"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "EKS node memory utilization is high"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = aws_eks_cluster.region.name
  }

  tags = local.common_tags
}

resource "aws_cloudwatch_metric_alarm" "rds_cpu" {
  alarm_name          = "${local.name_prefix}-rds-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Aurora CPU utilization is high"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBClusterIdentifier = aws_rds_cluster.region.cluster_identifier
  }

  tags = local.common_tags
}

resource "aws_cloudwatch_metric_alarm" "redis_cpu" {
  alarm_name          = "${local.name_prefix}-redis-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ElastiCache"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Redis CPU utilization is high"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    CacheClusterId = aws_elasticache_replication_group.region.id
  }

  tags = local.common_tags
}

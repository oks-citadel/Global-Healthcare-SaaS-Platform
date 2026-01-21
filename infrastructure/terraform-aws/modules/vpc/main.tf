# ============================================
# AWS VPC Module
# ============================================
# Replaces: Azure Virtual Network (VNet)
# Translation: VNet → VPC, Subnet → Subnet, NSG → Security Group
# ============================================

locals {
  name = "${var.project_name}-${var.environment}-${var.region_name}"

  tags = merge(var.tags, {
    Module = "vpc"
  })
}

# ============================================
# VPC
# ============================================

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(local.tags, {
    Name = "${local.name}-vpc"
  })
}

# ============================================
# Internet Gateway
# ============================================

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(local.tags, {
    Name = "${local.name}-igw"
  })
}

# ============================================
# NAT Gateways (High Availability)
# ============================================

resource "aws_eip" "nat" {
  count  = var.enable_nat_gateway ? length(var.availability_zones) : 0
  domain = "vpc"

  tags = merge(local.tags, {
    Name = "${local.name}-nat-eip-${count.index + 1}"
  })

  depends_on = [aws_internet_gateway.main]
}

resource "aws_nat_gateway" "main" {
  count         = var.enable_nat_gateway ? length(var.availability_zones) : 0
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = merge(local.tags, {
    Name = "${local.name}-nat-${count.index + 1}"
  })

  depends_on = [aws_internet_gateway.main]
}

# ============================================
# Public Subnets
# ============================================

resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index % length(var.availability_zones)]
  map_public_ip_on_launch = true

  tags = merge(local.tags, {
    Name                                      = "${local.name}-public-${count.index + 1}"
    Type                                      = "public"
    "kubernetes.io/role/elb"                  = "1"
    "kubernetes.io/cluster/${local.name}-eks" = "shared"
  })
}

# ============================================
# Private Subnets (Application/EKS)
# ============================================

resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index % length(var.availability_zones)]

  tags = merge(local.tags, {
    Name                                      = "${local.name}-private-${count.index + 1}"
    Type                                      = "private"
    "kubernetes.io/role/internal-elb"         = "1"
    "kubernetes.io/cluster/${local.name}-eks" = "shared"
  })
}

# ============================================
# Database Subnets
# ============================================

resource "aws_subnet" "database" {
  count             = length(var.database_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.database_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index % length(var.availability_zones)]

  tags = merge(local.tags, {
    Name = "${local.name}-database-${count.index + 1}"
    Type = "database"
  })
}

resource "aws_db_subnet_group" "main" {
  name        = "${local.name}-db-subnet-group"
  description = "Database subnet group for ${local.name}"
  subnet_ids  = aws_subnet.database[*].id

  tags = merge(local.tags, {
    Name = "${local.name}-db-subnet-group"
  })
}

# ============================================
# ElastiCache Subnets
# ============================================

resource "aws_subnet" "elasticache" {
  count             = length(var.elasticache_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.elasticache_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index % length(var.availability_zones)]

  tags = merge(local.tags, {
    Name = "${local.name}-elasticache-${count.index + 1}"
    Type = "elasticache"
  })
}

resource "aws_elasticache_subnet_group" "main" {
  name        = "${local.name}-elasticache-subnet-group"
  description = "ElastiCache subnet group for ${local.name}"
  subnet_ids  = aws_subnet.elasticache[*].id

  tags = merge(local.tags, {
    Name = "${local.name}-elasticache-subnet-group"
  })
}

# ============================================
# Route Tables - Public
# ============================================

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(local.tags, {
    Name = "${local.name}-public-rt"
    Type = "public"
  })
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# ============================================
# Route Tables - Private
# ============================================

resource "aws_route_table" "private" {
  count  = var.enable_nat_gateway ? length(var.availability_zones) : 1
  vpc_id = aws_vpc.main.id

  dynamic "route" {
    for_each = var.enable_nat_gateway ? [1] : []
    content {
      cidr_block     = "0.0.0.0/0"
      nat_gateway_id = aws_nat_gateway.main[count.index % length(aws_nat_gateway.main)].id
    }
  }

  tags = merge(local.tags, {
    Name = "${local.name}-private-rt-${count.index + 1}"
    Type = "private"
  })
}

resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index % length(aws_route_table.private)].id
}

resource "aws_route_table_association" "database" {
  count          = length(aws_subnet.database)
  subnet_id      = aws_subnet.database[count.index].id
  route_table_id = aws_route_table.private[count.index % length(aws_route_table.private)].id
}

resource "aws_route_table_association" "elasticache" {
  count          = length(aws_subnet.elasticache)
  subnet_id      = aws_subnet.elasticache[count.index].id
  route_table_id = aws_route_table.private[count.index % length(aws_route_table.private)].id
}

# ============================================
# VPC Flow Logs
# ============================================

resource "aws_flow_log" "main" {
  count                = var.enable_flow_logs ? 1 : 0
  iam_role_arn         = aws_iam_role.flow_logs[0].arn
  log_destination      = aws_cloudwatch_log_group.flow_logs[0].arn
  log_destination_type = "cloud-watch-logs"
  traffic_type         = "ALL"
  vpc_id               = aws_vpc.main.id

  tags = merge(local.tags, {
    Name = "${local.name}-flow-logs"
  })
}

resource "aws_cloudwatch_log_group" "flow_logs" {
  count             = var.enable_flow_logs ? 1 : 0
  name              = "/aws/vpc/${local.name}/flow-logs"
  retention_in_days = var.flow_logs_retention_days

  tags = merge(local.tags, {
    Name = "${local.name}-flow-logs"
  })
}

resource "aws_iam_role" "flow_logs" {
  count = var.enable_flow_logs ? 1 : 0
  name  = "${local.name}-flow-logs-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "vpc-flow-logs.amazonaws.com"
        }
      }
    ]
  })

  tags = local.tags
}

resource "aws_iam_role_policy" "flow_logs" {
  count = var.enable_flow_logs ? 1 : 0
  name  = "${local.name}-flow-logs-policy"
  role  = aws_iam_role.flow_logs[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

# ============================================
# VPC Endpoints (Private connectivity to AWS services)
# ============================================

resource "aws_vpc_endpoint" "s3" {
  count             = var.enable_vpc_endpoints ? 1 : 0
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.${var.aws_region}.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = concat(aws_route_table.private[*].id, [aws_route_table.public.id])

  tags = merge(local.tags, {
    Name = "${local.name}-s3-endpoint"
  })
}

resource "aws_vpc_endpoint" "ecr_api" {
  count               = var.enable_vpc_endpoints ? 1 : 0
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${var.aws_region}.ecr.api"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.private[*].id
  security_group_ids  = [aws_security_group.vpc_endpoints[0].id]
  private_dns_enabled = true

  tags = merge(local.tags, {
    Name = "${local.name}-ecr-api-endpoint"
  })
}

resource "aws_vpc_endpoint" "ecr_dkr" {
  count               = var.enable_vpc_endpoints ? 1 : 0
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${var.aws_region}.ecr.dkr"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.private[*].id
  security_group_ids  = [aws_security_group.vpc_endpoints[0].id]
  private_dns_enabled = true

  tags = merge(local.tags, {
    Name = "${local.name}-ecr-dkr-endpoint"
  })
}

resource "aws_vpc_endpoint" "secretsmanager" {
  count               = var.enable_vpc_endpoints ? 1 : 0
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${var.aws_region}.secretsmanager"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.private[*].id
  security_group_ids  = [aws_security_group.vpc_endpoints[0].id]
  private_dns_enabled = true

  tags = merge(local.tags, {
    Name = "${local.name}-secretsmanager-endpoint"
  })
}

resource "aws_security_group" "vpc_endpoints" {
  count       = var.enable_vpc_endpoints ? 1 : 0
  name        = "${local.name}-vpc-endpoints-sg"
  description = "Security group for VPC endpoints"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTPS from VPC"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  # trivy:ignore:aws-vpc-no-public-egress-sgr VPC endpoints require outbound connectivity to AWS services
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.tags, {
    Name = "${local.name}-vpc-endpoints-sg"
  })
}

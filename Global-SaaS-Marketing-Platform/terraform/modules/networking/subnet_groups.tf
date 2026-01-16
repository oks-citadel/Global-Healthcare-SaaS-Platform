################################################################################
# Subnet Groups
# Global SaaS Marketing Platform - Networking Module
################################################################################

################################################################################
# DB Subnet Group (for RDS Aurora)
################################################################################

resource "aws_db_subnet_group" "main" {
  name        = "${var.project_name}-${var.environment}-db-subnet-group"
  description = "Database subnet group for ${var.project_name} ${var.environment}"
  subnet_ids  = aws_subnet.data[*].id

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-db-subnet-group"
  })
}

################################################################################
# ElastiCache Subnet Group
################################################################################

resource "aws_elasticache_subnet_group" "main" {
  name        = "${var.project_name}-${var.environment}-elasticache-subnet-group"
  description = "ElastiCache subnet group for ${var.project_name} ${var.environment}"
  subnet_ids  = aws_subnet.data[*].id

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-elasticache-subnet-group"
  })
}

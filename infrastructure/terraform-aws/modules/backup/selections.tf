# ============================================
# AWS Backup Module - Resource Selections
# ============================================

locals {
  selection_name = var.selection_name != "" ? var.selection_name : "${local.name}-backup-selection"

  # Build selection tags from the map
  selection_tag_conditions = [
    for k, v in var.selection_tags : {
      type  = "STRINGEQUALS"
      key   = k
      value = v
    }
  ]

  # Combine user-provided tags with computed ones
  all_selection_tags = concat(
    var.backup_resource_tags,
    local.selection_tag_conditions
  )
}

# ============================================
# Backup Selection - By Resource ARN
# ============================================

resource "aws_backup_selection" "resources" {
  count = length(var.backup_resources) > 0 ? 1 : 0

  name         = "${local.selection_name}-resources"
  plan_id      = aws_backup_plan.main.id
  iam_role_arn = aws_iam_role.backup.arn

  resources     = var.backup_resources
  not_resources = var.not_resources
}

# ============================================
# Backup Selection - By Tags
# ============================================

resource "aws_backup_selection" "tags" {
  count = length(local.all_selection_tags) > 0 ? 1 : 0

  name         = "${local.selection_name}-tags"
  plan_id      = aws_backup_plan.main.id
  iam_role_arn = aws_iam_role.backup.arn

  dynamic "selection_tag" {
    for_each = local.all_selection_tags
    content {
      type  = selection_tag.value.type
      key   = selection_tag.value.key
      value = selection_tag.value.value
    }
  }

  not_resources = var.not_resources
}

# ============================================
# Backup Selection - All RDS Databases
# ============================================

resource "aws_backup_selection" "rds" {
  name         = "${local.selection_name}-rds"
  plan_id      = aws_backup_plan.main.id
  iam_role_arn = aws_iam_role.backup.arn

  selection_tag {
    type  = "STRINGEQUALS"
    key   = "aws:backup:source-resource"
    value = "rds"
  }

  # Backup all RDS resources with environment tag
  selection_tag {
    type  = "STRINGEQUALS"
    key   = "Environment"
    value = var.environment
  }

  not_resources = var.not_resources

  # Condition for RDS resources
  condition {
    string_equals {
      key   = "aws:ResourceTag/Backup"
      value = "true"
    }
  }
}

# ============================================
# Backup Selection - All EBS Volumes
# ============================================

resource "aws_backup_selection" "ebs" {
  name         = "${local.selection_name}-ebs"
  plan_id      = aws_backup_plan.main.id
  iam_role_arn = aws_iam_role.backup.arn

  # Select EBS volumes marked for backup
  selection_tag {
    type  = "STRINGEQUALS"
    key   = "Backup"
    value = "true"
  }

  selection_tag {
    type  = "STRINGEQUALS"
    key   = "Environment"
    value = var.environment
  }

  not_resources = var.not_resources
}

# ============================================
# Backup Selection - DynamoDB Tables
# ============================================

resource "aws_backup_selection" "dynamodb" {
  name         = "${local.selection_name}-dynamodb"
  plan_id      = aws_backup_plan.main.id
  iam_role_arn = aws_iam_role.backup.arn

  selection_tag {
    type  = "STRINGEQUALS"
    key   = "Backup"
    value = "true"
  }

  selection_tag {
    type  = "STRINGEQUALS"
    key   = "Environment"
    value = var.environment
  }

  # Only include DynamoDB resources
  condition {
    string_like {
      key   = "aws:ResourceTag/aws:backup:source-resource"
      value = "dynamodb*"
    }
  }

  not_resources = var.not_resources
}

# ============================================
# Backup Selection - EFS File Systems
# ============================================

resource "aws_backup_selection" "efs" {
  name         = "${local.selection_name}-efs"
  plan_id      = aws_backup_plan.main.id
  iam_role_arn = aws_iam_role.backup.arn

  selection_tag {
    type  = "STRINGEQUALS"
    key   = "Backup"
    value = "true"
  }

  selection_tag {
    type  = "STRINGEQUALS"
    key   = "Environment"
    value = var.environment
  }

  not_resources = var.not_resources
}

# ============================================
# Backup Selection - Aurora Clusters
# ============================================

resource "aws_backup_selection" "aurora" {
  name         = "${local.selection_name}-aurora"
  plan_id      = aws_backup_plan.main.id
  iam_role_arn = aws_iam_role.backup.arn

  selection_tag {
    type  = "STRINGEQUALS"
    key   = "Engine"
    value = "aurora-postgresql"
  }

  selection_tag {
    type  = "STRINGEQUALS"
    key   = "Environment"
    value = var.environment
  }

  not_resources = var.not_resources
}

# =============================================================================
# ECS Fargate Service Module
# =============================================================================
# This module creates an ECS service with Fargate launch type
# Includes task definition, auto-scaling, and ALB integration
# =============================================================================

# -----------------------------------------------------------------------------
# CloudWatch Log Group for Service
# -----------------------------------------------------------------------------
resource "aws_cloudwatch_log_group" "service" {
  name              = "/aws/ecs/${var.cluster_name}/${var.service_name}"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.kms_key_arn

  tags = merge(var.tags, {
    Name    = "${var.service_name}-logs"
    Service = var.service_name
  })
}

# -----------------------------------------------------------------------------
# Task Definition
# -----------------------------------------------------------------------------
resource "aws_ecs_task_definition" "main" {
  family                   = "${var.project}-${var.environment}-${var.service_name}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = var.task_execution_role_arn
  task_role_arn            = var.task_role_arn != "" ? var.task_role_arn : null

  container_definitions = jsonencode([
    {
      name  = var.service_name
      image = "${var.ecr_repository_url}:${var.image_tag}"

      essential = true

      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
          protocol      = "tcp"
        }
      ]

      environment = [
        for key, value in var.environment_variables : {
          name  = key
          value = value
        }
      ]

      secrets = [
        for key, value in var.secrets : {
          name      = key
          valueFrom = value
        }
      ]

      healthCheck = var.health_check_path != "" ? {
        command     = ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:${var.container_port}${var.health_check_path} || exit 1"]
        interval    = var.health_check_interval
        timeout     = var.health_check_timeout
        retries     = var.health_check_retries
        startPeriod = var.health_check_start_period
      } : null

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.service.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = var.service_name
        }
      }

      # Graceful shutdown
      stopTimeout = 30
    }
  ])

  tags = merge(var.tags, {
    Name    = "${var.project}-${var.environment}-${var.service_name}"
    Service = var.service_name
  })
}

# -----------------------------------------------------------------------------
# ECS Service
# -----------------------------------------------------------------------------
resource "aws_ecs_service" "main" {
  name            = var.service_name
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.main.arn
  desired_count   = var.desired_count
  launch_type     = var.use_spot ? null : "FARGATE"

  # Use capacity provider strategy if Spot is enabled
  dynamic "capacity_provider_strategy" {
    for_each = var.use_spot ? [1] : []
    content {
      capacity_provider = "FARGATE_SPOT"
      weight            = 80
      base              = 0
    }
  }

  dynamic "capacity_provider_strategy" {
    for_each = var.use_spot ? [1] : []
    content {
      capacity_provider = "FARGATE"
      weight            = 20
      base              = 1
    }
  }

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.security_group_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.main.arn
    container_name   = var.service_name
    container_port   = var.container_port
  }

  # Service discovery (optional)
  dynamic "service_registries" {
    for_each = var.service_discovery_registry_arn != "" ? [1] : []
    content {
      registry_arn = var.service_discovery_registry_arn
    }
  }

  # Deployment configuration
  deployment_minimum_healthy_percent = var.deployment_minimum_healthy_percent
  deployment_maximum_percent         = var.deployment_maximum_percent

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  # Enable ECS Exec for debugging
  enable_execute_command = var.enable_execute_command

  # Prevent Terraform from reverting image changes made by CI/CD
  lifecycle {
    ignore_changes = [task_definition]
  }

  depends_on = [aws_lb_target_group.main]

  tags = merge(var.tags, {
    Name    = var.service_name
    Service = var.service_name
  })
}

# -----------------------------------------------------------------------------
# ALB Target Group
# -----------------------------------------------------------------------------
resource "aws_lb_target_group" "main" {
  name        = "${var.project}-${var.environment}-${var.service_name}"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    path                = var.health_check_path != "" ? var.health_check_path : "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200-299"
  }

  deregistration_delay = 30

  tags = merge(var.tags, {
    Name    = "${var.project}-${var.environment}-${var.service_name}"
    Service = var.service_name
  })
}

# -----------------------------------------------------------------------------
# ALB Listener Rule
# -----------------------------------------------------------------------------
resource "aws_lb_listener_rule" "main" {
  count = var.create_listener_rule ? 1 : 0

  listener_arn = var.alb_listener_arn
  priority     = var.listener_rule_priority

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.arn
  }

  condition {
    path_pattern {
      values = var.path_patterns
    }
  }

  tags = merge(var.tags, {
    Service = var.service_name
  })
}

# -----------------------------------------------------------------------------
# Auto Scaling
# -----------------------------------------------------------------------------
resource "aws_appautoscaling_target" "main" {
  count = var.enable_autoscaling ? 1 : 0

  max_capacity       = var.max_capacity
  min_capacity       = var.min_capacity
  resource_id        = "service/${var.cluster_name}/${aws_ecs_service.main.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# CPU-based scaling
resource "aws_appautoscaling_policy" "cpu" {
  count = var.enable_autoscaling ? 1 : 0

  name               = "${var.service_name}-cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.main[0].resource_id
  scalable_dimension = aws_appautoscaling_target.main[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.main[0].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = var.cpu_scaling_target
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

# Memory-based scaling
resource "aws_appautoscaling_policy" "memory" {
  count = var.enable_autoscaling ? 1 : 0

  name               = "${var.service_name}-memory-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.main[0].resource_id
  scalable_dimension = aws_appautoscaling_target.main[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.main[0].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    target_value       = var.memory_scaling_target
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

# -----------------------------------------------------------------------------
# CloudWatch Alarms
# -----------------------------------------------------------------------------
resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  count = var.enable_alarms ? 1 : 0

  alarm_name          = "${var.service_name}-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 90
  alarm_description   = "CPU utilization is too high for ${var.service_name}"

  dimensions = {
    ClusterName = var.cluster_name
    ServiceName = aws_ecs_service.main.name
  }

  alarm_actions = var.alarm_sns_topic_arns
  ok_actions    = var.alarm_sns_topic_arns

  tags = merge(var.tags, {
    Service = var.service_name
  })
}

resource "aws_cloudwatch_metric_alarm" "memory_high" {
  count = var.enable_alarms ? 1 : 0

  alarm_name          = "${var.service_name}-memory-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 90
  alarm_description   = "Memory utilization is too high for ${var.service_name}"

  dimensions = {
    ClusterName = var.cluster_name
    ServiceName = aws_ecs_service.main.name
  }

  alarm_actions = var.alarm_sns_topic_arns
  ok_actions    = var.alarm_sns_topic_arns

  tags = merge(var.tags, {
    Service = var.service_name
  })
}

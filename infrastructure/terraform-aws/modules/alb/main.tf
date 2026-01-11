# ============================================
# AWS ALB Module
# ============================================
# Replaces: Azure Application Gateway
# Translation: App Gateway → Application Load Balancer
# ============================================

locals {
  name = "${var.project_name}-${var.environment}-${var.region_name}"

  tags = merge(var.tags, {
    Module = "alb"
  })
}

# ============================================
# Application Load Balancer
# ============================================

resource "aws_lb" "main" {
  name               = "${local.name}-alb"
  internal           = var.internal
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.subnet_ids

  enable_deletion_protection = var.deletion_protection
  enable_http2               = true
  idle_timeout               = var.idle_timeout

  access_logs {
    bucket  = var.access_logs_bucket
    prefix  = "alb/${local.name}"
    enabled = var.enable_access_logs
  }

  tags = merge(local.tags, {
    Name = "${local.name}-alb"
  })
}

# ============================================
# HTTPS Listener
# ============================================

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = var.certificate_arn

  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "application/json"
      message_body = jsonencode({ error = "Not Found" })
      status_code  = "404"
    }
  }

  tags = local.tags
}

# HTTP to HTTPS redirect
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }

  tags = local.tags
}

# ============================================
# Target Groups
# ============================================

resource "aws_lb_target_group" "services" {
  for_each = var.target_groups

  name        = "${local.name}-${each.key}"
  port        = each.value.port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = each.value.health_check_matcher
    path                = each.value.health_check_path
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 3
  }

  deregistration_delay = 30

  tags = merge(local.tags, {
    Name    = "${local.name}-${each.key}"
    Service = each.key
  })

  lifecycle {
    create_before_destroy = true
  }
}

# ============================================
# Listener Rules
# ============================================

resource "aws_lb_listener_rule" "services" {
  for_each = var.target_groups

  listener_arn = aws_lb_listener.https.arn
  priority     = each.value.priority

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.services[each.key].arn
  }

  condition {
    path_pattern {
      values = each.value.path_patterns
    }
  }

  # Optional: CloudFront origin validation (only if cloudfront_secret is set)
  dynamic "condition" {
    for_each = toset(compact([var.cloudfront_secret]))
    content {
      http_header {
        http_header_name = "X-CloudFront-Secret"
        values           = [condition.value]
      }
    }
  }

  tags = local.tags
}

# ============================================
# Security Group
# ============================================

resource "aws_security_group" "alb" {
  name        = "${local.name}-alb-sg"
  description = "Security group for ALB"
  vpc_id      = var.vpc_id

  tags = merge(local.tags, {
    Name = "${local.name}-alb-sg"
  })
}

resource "aws_security_group_rule" "alb_ingress_https" {
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = var.internal ? var.allowed_cidrs : ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb.id
  description       = "HTTPS ingress"
}

resource "aws_security_group_rule" "alb_ingress_http" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = var.internal ? var.allowed_cidrs : ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb.id
  description       = "HTTP ingress (redirect)"
}

resource "aws_security_group_rule" "alb_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb.id
  description       = "Allow all egress"
}

# ============================================
# CloudWatch Alarms
# ============================================

resource "aws_cloudwatch_metric_alarm" "unhealthy_hosts" {
  for_each = var.target_groups

  alarm_name          = "${local.name}-${each.key}-unhealthy-hosts"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "UnHealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Average"
  threshold           = 0
  alarm_description   = "Unhealthy hosts in ${each.key} target group"
  alarm_actions       = var.alarm_sns_topic_arns

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
    TargetGroup  = aws_lb_target_group.services[each.key].arn_suffix
  }

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "response_time" {
  alarm_name          = "${local.name}-alb-response-time"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  extended_statistic  = "p95"
  threshold           = 2
  alarm_description   = "ALB p95 response time is high"
  alarm_actions       = var.alarm_sns_topic_arns

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "error_rate" {
  alarm_name          = "${local.name}-alb-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "HTTPCode_ELB_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "ALB 5xx error count is high"
  alarm_actions       = var.alarm_sns_topic_arns
  treat_missing_data  = "notBreaching"

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }

  tags = local.tags
}

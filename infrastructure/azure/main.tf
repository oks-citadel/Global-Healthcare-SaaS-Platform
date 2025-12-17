# ============================================
# UnifiedHealth Platform - Azure Infrastructure
# Terraform Configuration
# ============================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.80"
    }
  }

  backend "azurerm" {
    resource_group_name  = "unifiedhealth-tfstate-rg"
    storage_account_name = "unifiedhealthtfstate"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
}

variable "environment" {
  default = "prod"
}

variable "location" {
  default = "East US"
}

variable "project_name" {
  default = "unifiedhealth"
}

variable "db_admin_password" {
  type      = string
  sensitive = true
}

locals {
  resource_prefix = "${var.project_name}-${var.environment}"
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

resource "azurerm_resource_group" "main" {
  name     = "${local.resource_prefix}-rg"
  location = var.location
  tags     = local.common_tags
}

resource "azurerm_container_registry" "acr" {
  name                = "${var.project_name}acr${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Standard"
  admin_enabled       = true
  tags                = local.common_tags
}

resource "azurerm_postgresql_flexible_server" "db" {
  name                   = "${local.resource_prefix}-postgres"
  resource_group_name    = azurerm_resource_group.main.name
  location               = azurerm_resource_group.main.location
  version                = "15"
  administrator_login    = "unifiedhealth_admin"
  administrator_password = var.db_admin_password
  storage_mb             = 32768
  sku_name               = "GP_Standard_D2s_v3"
  zone                   = "1"
  tags                   = local.common_tags
}

resource "azurerm_redis_cache" "redis" {
  name                = "${local.resource_prefix}-redis"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  capacity            = 1
  family              = "C"
  sku_name            = "Standard"
  minimum_tls_version = "1.2"
  tags                = local.common_tags
}

resource "azurerm_storage_account" "storage" {
  name                     = "${var.project_name}storage${var.environment}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "GRS"
  min_tls_version          = "TLS1_2"
  tags                     = local.common_tags
}

resource "azurerm_log_analytics_workspace" "logs" {
  name                = "${local.resource_prefix}-logs"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = local.common_tags
}

resource "azurerm_container_app_environment" "env" {
  name                       = "${local.resource_prefix}-env"
  resource_group_name        = azurerm_resource_group.main.name
  location                   = azurerm_resource_group.main.location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.logs.id
  tags                       = local.common_tags
}

output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}

output "postgres_fqdn" {
  value = azurerm_postgresql_flexible_server.db.fqdn
}

output "redis_hostname" {
  value = azurerm_redis_cache.redis.hostname
}


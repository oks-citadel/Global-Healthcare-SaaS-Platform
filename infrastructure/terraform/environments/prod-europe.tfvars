# ============================================
# Production - Europe Region Configuration
# ============================================
# Configuration for the Europe region deployment
# Compliance: GDPR, ISO27001
# Currencies: EUR, GBP

environment    = "prod"
region_name    = "europe"
location       = "westeurope"
location_short = "weu"

# ============================================
# Compliance & Data Residency
# ============================================

compliance_standards     = ["GDPR", "ISO27001", "SOC2"]
data_residency_required  = true
supported_currencies     = ["EUR", "GBP", "CHF", "SEK", "NOK"]

# ============================================
# Network Configuration
# ============================================

vnet_address_space      = "10.20.0.0/16"
aks_subnet_prefix       = "10.20.0.0/20"
database_subnet_prefix  = "10.20.16.0/24"
appgw_subnet_prefix     = "10.20.32.0/24"

# ============================================
# AKS Configuration (Production - High Availability)
# ============================================

kubernetes_version      = "1.28.3"
aks_system_node_count   = 3
aks_system_node_size    = "Standard_D4s_v3"
aks_system_node_min     = 3
aks_system_node_max     = 6

aks_user_node_count     = 5
aks_user_node_size      = "Standard_D8s_v3"
aks_user_node_min       = 5
aks_user_node_max       = 20

# ============================================
# PostgreSQL Configuration
# ============================================

postgresql_sku                = "GP_Standard_D4s_v3"
postgresql_storage_mb         = 262144  # 256 GB
postgresql_high_availability  = true

# ============================================
# Redis Configuration
# ============================================

redis_capacity = 3
redis_family   = "P"
redis_sku      = "Premium"

# ============================================
# Monitoring
# ============================================

alert_email_address = "ops-europe@unifiedhealth.example.com"
alert_webhook_url   = ""

# ============================================
# Additional Tags
# ============================================

additional_tags = {
  Region          = "Europe"
  DataCenter      = "WestEurope"
  ComplianceZone  = "GDPR-ISO27001"
  CostCenter      = "Healthcare-Europe"
  BusinessUnit    = "UnifiedHealth-Europe"
}

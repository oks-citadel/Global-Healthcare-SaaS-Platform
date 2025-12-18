# ============================================
# Production - Africa Region Configuration
# ============================================
# Configuration for the Africa region deployment
# Compliance: POPIA, ISO27001
# Currencies: ZAR, NGN, KES

environment    = "prod"
region_name    = "africa"
location       = "southafricanorth"
location_short = "san"

# ============================================
# Compliance & Data Residency
# ============================================

compliance_standards     = ["POPIA", "ISO27001", "SOC2"]
data_residency_required  = true
supported_currencies     = ["ZAR", "NGN", "KES", "EGP", "GHS"]

# ============================================
# Network Configuration
# ============================================

vnet_address_space      = "10.30.0.0/16"
aks_subnet_prefix       = "10.30.0.0/20"
database_subnet_prefix  = "10.30.16.0/24"
appgw_subnet_prefix     = "10.30.32.0/24"

# ============================================
# AKS Configuration (Production - High Availability)
# ============================================

kubernetes_version      = "1.28.3"
aks_system_node_count   = 3
aks_system_node_size    = "Standard_D4s_v3"
aks_system_node_min     = 3
aks_system_node_max     = 6

aks_user_node_count     = 4
aks_user_node_size      = "Standard_D8s_v3"
aks_user_node_min       = 4
aks_user_node_max       = 15

# ============================================
# PostgreSQL Configuration
# ============================================

postgresql_sku                = "GP_Standard_D4s_v3"
postgresql_storage_mb         = 131072  # 128 GB
postgresql_high_availability  = true

# ============================================
# Redis Configuration
# ============================================

redis_capacity = 2
redis_family   = "P"
redis_sku      = "Premium"

# ============================================
# Monitoring
# ============================================

alert_email_address = "ops-africa@unifiedhealth.example.com"
alert_webhook_url   = ""

# ============================================
# Additional Tags
# ============================================

additional_tags = {
  Region          = "Africa"
  DataCenter      = "SouthAfricaNorth"
  ComplianceZone  = "POPIA-ISO27001"
  CostCenter      = "Healthcare-Africa"
  BusinessUnit    = "UnifiedHealth-Africa"
}

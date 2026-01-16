# ============================================
# Production - Americas Region Configuration
# ============================================
# Configuration for the Americas region deployment
# Compliance: HIPAA, SOC2
# Currencies: USD

environment    = "prod"
region_name    = "americas"
location       = "eastus"
location_short = "eus"

# ============================================
# Compliance & Data Residency
# ============================================

compliance_standards     = ["HIPAA", "SOC2", "ISO27001"]
data_residency_required  = true
supported_currencies     = ["USD", "CAD", "MXN"]

# ============================================
# Network Configuration
# ============================================

vnet_address_space      = "10.10.0.0/16"
aks_subnet_prefix       = "10.10.0.0/20"
database_subnet_prefix  = "10.10.16.0/24"
appgw_subnet_prefix     = "10.10.32.0/24"

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

alert_email_address = "ops-americas@unifiedhealth.example.com"
alert_webhook_url   = ""

# ============================================
# Additional Tags
# ============================================

additional_tags = {
  Region          = "Americas"
  DataCenter      = "EastUS"
  ComplianceZone  = "HIPAA-SOC2"
  CostCenter      = "Healthcare-Americas"
  BusinessUnit    = "UnifiedHealth-Americas"
}

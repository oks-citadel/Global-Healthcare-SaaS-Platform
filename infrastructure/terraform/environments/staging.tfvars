# ============================================
# Staging Environment Variables
# ============================================
# Staging environment mirrors production architecture but with reduced resources
# Used for final testing before production deployment and integration testing

# Azure Subscription Configuration
subscription_id = "d8afbfb0-0c60-4d11-a1c7-a614235f5eb6"

environment = "staging"
location    = "eastus"

# Network Configuration
# Separate address space from dev/prod to allow peering if needed
vnet_address_space     = "10.2.0.0/16"
aks_subnet_prefix      = "10.2.0.0/20"
database_subnet_prefix = "10.2.16.0/24"

# AKS Configuration
# Staging uses production-like setup but with fewer nodes
# Sufficient for load testing and integration validation
kubernetes_version    = "1.28.3"
aks_system_node_count = 2
aks_system_node_size  = "Standard_DS2_v2"
aks_system_node_min   = 2
aks_system_node_max   = 4
aks_user_node_count   = 3
aks_user_node_size    = "Standard_DS3_v2" # Match prod VM size but fewer nodes
aks_user_node_min     = 3
aks_user_node_max     = 8

# ACR Configuration
# No geo-replication for staging to reduce costs
acr_georeplications = []

# PostgreSQL Configuration
# General Purpose tier with sufficient resources for staging workloads
# Smaller than production but production-class features enabled
postgresql_sku        = "GP_Standard_D2s_v3"
postgresql_storage_mb = 65536 # 64 GB

# Redis Configuration
# Standard tier with moderate capacity for caching and session management
redis_capacity = 1
redis_family   = "C"
redis_sku      = "Standard"

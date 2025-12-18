# ============================================
# Development Environment Variables
# ============================================

# Azure Subscription Configuration
subscription_id = "d8afbfb0-0c60-4d11-a1c7-a614235f5eb6"

environment = "dev"
location    = "eastus"

# AKS Configuration
kubernetes_version    = "1.28.3"
aks_system_node_count = 2
aks_system_node_size  = "Standard_DS2_v2"
aks_system_node_min   = 2
aks_system_node_max   = 3
aks_user_node_count   = 2
aks_user_node_size    = "Standard_DS2_v2"
aks_user_node_min     = 2
aks_user_node_max     = 5

# PostgreSQL Configuration
postgresql_sku        = "B_Standard_B1ms"
postgresql_storage_mb = 32768

# Redis Configuration
redis_capacity = 0
redis_family   = "C"
redis_sku      = "Basic"

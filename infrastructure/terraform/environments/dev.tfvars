# ============================================
# Development Environment Variables
# ============================================

# Azure Subscription Configuration
subscription_id = "d8afbfb0-0c60-4d11-a1c7-a614235f5eb6"

environment = "dev2"
location    = "westus2"

# AKS Configuration
kubernetes_version    = "1.32"
aks_system_node_count = 1
aks_system_node_size  = "Standard_D2s_v3"
aks_system_node_min   = 1
aks_system_node_max   = 2
aks_user_node_count   = 1
aks_user_node_size    = "Standard_D2s_v3"
aks_user_node_min     = 1
aks_user_node_max     = 2

# PostgreSQL Configuration
postgresql_sku        = "B_Standard_B1ms"
postgresql_storage_mb = 32768

# Redis Configuration
redis_capacity = 0
redis_family   = "C"
redis_sku      = "Basic"

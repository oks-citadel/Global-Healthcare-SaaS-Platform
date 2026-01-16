# ============================================
# Production Environment Variables
# ============================================
# Production environment with high availability, geo-redundancy, and scalability
# Optimized for performance, reliability, and HIPAA compliance

# Azure Subscription Configuration
subscription_id = "d8afbfb0-0c60-4d11-a1c7-a614235f5eb6"

environment = "prod"
location    = "eastus"

# Network Configuration
# Production network with dedicated address space
# Sized for future growth and microservices expansion
vnet_address_space     = "10.0.0.0/16"
aks_subnet_prefix      = "10.0.0.0/20"
database_subnet_prefix = "10.0.16.0/24"

# AKS Configuration
# Production-grade cluster with high availability and auto-scaling
# System nodes: Run critical system pods (CoreDNS, metrics-server, etc.)
# User nodes: Run application workloads with horizontal scaling capability
kubernetes_version    = "1.28.3"
aks_system_node_count = 3                 # HA across availability zones
aks_system_node_size  = "Standard_DS3_v2" # 4 vCPU, 14 GB RAM
aks_system_node_min   = 3
aks_system_node_max   = 6
aks_user_node_count   = 5                 # Higher baseline for production traffic
aks_user_node_size    = "Standard_DS4_v2" # 8 vCPU, 28 GB RAM for better performance
aks_user_node_min     = 5
aks_user_node_max     = 20 # Scale up for peak loads

# ACR Configuration
# Geo-replication for high availability and faster image pulls globally
# Zone redundancy enabled for disaster recovery
acr_georeplications = [
  {
    location        = "westus"
    zone_redundancy = true
  },
  {
    location        = "westeurope"
    zone_redundancy = true
  }
]

# PostgreSQL Configuration
# Memory-optimized tier for production database workloads
# High storage allocation for patient data, medical records, and audit logs
postgresql_sku        = "MO_Standard_E4s_v3" # 4 vCPU, 32 GB RAM, memory-optimized
postgresql_storage_mb = 262144               # 256 GB with room for growth

# Redis Configuration
# Premium tier with larger capacity for high-performance caching
# Supports data persistence and geo-replication if needed
redis_capacity = 2
redis_family   = "P"
redis_sku      = "Premium"

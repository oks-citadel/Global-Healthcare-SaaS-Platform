# UnifiedHealth Platform - Unified Documentation

**Single Source of Truth for Platform Development**

> This folder contains all authoritative documentation for the UnifiedHealth Platform.
> All guidance, PRDs, inventories, and runbooks live here.

## Documentation Structure

```
/docs-unified/
├── README.md                    # This file - documentation index
├── vision/                      # Platform vision and scope
│   ├── platform-overview.md     # High-level platform overview
│   ├── healthcare-scope.md      # Healthcare domain scope
│   └── mvp-vs-phase2.md         # MVP vs Phase 2 feature breakdown
├── architecture/                # System architecture
│   ├── system-architecture.md   # Overall system design
│   ├── service-map.md           # Microservices mapping
│   ├── data-flow.md             # Data flow diagrams
│   ├── security-architecture.md # Security design
│   └── diagrams.mmd             # Mermaid diagrams
├── api/                         # API documentation
│   ├── api-inventory.md         # Complete API endpoint inventory
│   ├── openapi-guidelines.md    # OpenAPI specification standards
│   └── versioning.md            # API versioning strategy
├── services/                    # Service-specific documentation
│   └── [service-name]/          # Per-service docs
├── prd/                         # Product requirements
│   └── prd.md                   # Product Requirements Document
├── development/                 # Development standards
│   ├── development-inventory.md # Development tracking per endpoint
│   └── coding-standards.md      # Coding conventions
├── testing/                     # Testing documentation
│   ├── test-inventory.md        # Test coverage tracking
│   └── test-strategy.md         # Testing approach
├── mobile/                      # Mobile (Expo/EAS) documentation
│   ├── mobile-architecture.md   # Mobile app architecture
│   └── eas-deployment.md        # EAS build and deployment
├── infrastructure/              # Infrastructure documentation
│   ├── terraform-guide.md       # Terraform usage
│   └── aks-deployment.md        # AKS deployment guide
├── cicd/                        # CI/CD documentation
│   ├── github-actions.md        # GitHub Actions CI
│   └── jenkins-cd.md            # Jenkins CD pipelines
├── security-compliance/         # Security and compliance
│   ├── hipaa-compliance.md      # HIPAA requirements
│   └── security-controls.md     # Security measures
├── operations/                  # Operations runbooks
│   ├── runbooks.md              # Operational procedures
│   └── incident-response.md     # Incident handling
└── changelog.md                 # Documentation changelog
```

## Quick Links

| Document | Description | Status |
|----------|-------------|--------|
| [API Inventory](api/api-inventory.md) | Complete API endpoint listing | Active |
| [PRD](prd/prd.md) | Product Requirements Document | Active |
| [Development Inventory](development/development-inventory.md) | Per-endpoint development status | Active |
| [Test Inventory](testing/test-inventory.md) | Test coverage tracking | Active |
| [MVP vs Phase 2](vision/mvp-vs-phase2.md) | Feature phasing | Active |

## Documentation Rules

1. **Plain English**: Write step-by-step instructions anyone can follow
2. **Mermaid Diagrams**: Use Mermaid for all diagrams where applicable
3. **Same PR**: Documentation must be updated in the same PR as code changes
4. **Reality Reflection**: This README must always reflect the actual state of docs

## MVP Gate Criteria

Phase 2 features are **blocked** until MVP meets all criteria:

- [ ] All MVP API endpoints implemented and tested
- [ ] Backend builds successfully
- [ ] Frontend builds successfully
- [ ] Mobile builds (EAS) successfully
- [ ] GitHub Actions CI passes
- [ ] Jenkins CD deployment passes
- [ ] AKS rollout healthy
- [ ] API contracts match end-to-end
- [ ] Documentation is current

## Non-Negotiable Rules

1. **No plaintext secrets** - All secrets from Azure Key Vault or GitHub OIDC
2. **No local-only logic** - Everything containerized and deployable to AKS
3. **API-first** - OpenAPI is source of truth for all clients
4. **Complete fix definition** - Backend + Frontend + Mobile + CI + CD + Docs

---

*Last Updated: December 2024*
*Document Version: 1.0*

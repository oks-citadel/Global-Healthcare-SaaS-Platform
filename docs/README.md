# Unified Health Global Platform - Documentation

Welcome to the comprehensive documentation for the Unified Health Global Platform. This documentation is organized to help different stakeholders quickly find the information they need.

> **Note:** This folder (`docs/`) contains user and operational documentation. For development standards, API inventories, and PRD documents, see [docs-unified/](../docs-unified/README.md).

## Documentation Overview

### For Business & Product Teams
- [Executive Summary](../Executive-Summary.md) - High-level business overview and value proposition
- [Platform Requirements](../Plattform Requirement.md) - Detailed product requirements and specifications
- [Operational Structure](../Operational Structure.md) - Business operations and market strategy

### For Developers
- [Developer Guide](./developer/README.md) - Complete development setup and guidelines
- [Local Development Setup](./developer/LOCAL_SETUP.md) - Step-by-step setup instructions
- [Code Style Guide](./developer/CODE_STYLE.md) - Coding standards and best practices
- [Contributing Guidelines](./developer/CONTRIBUTING.md) - How to contribute to the project

### For DevOps & Infrastructure
- [Architecture Documentation](./architecture/README.md) - System architecture and design
- [Deployment Guide](./deployment/README.md) - Deployment instructions and procedures
- [Infrastructure as Code](./deployment/INFRASTRUCTURE.md) - Terraform and Kubernetes setup
- [Monitoring & Observability](./operations/MONITORING.md) - System monitoring and alerts

### For API Users & Integrators
- [API Reference](./api/README.md) - Complete API documentation
- [Authentication Guide](./api/AUTHENTICATION.md) - Authentication and authorization
- [API Endpoints](./api/ENDPOINTS.md) - Detailed endpoint reference
- [Error Codes](./api/ERROR_CODES.md) - Error handling and status codes
- [Integration Examples](./api/EXAMPLES.md) - Sample integrations and code examples

### For End Users
- [Patient User Guide](./user/PATIENT_GUIDE.md) - Guide for patients using the platform
- [Provider User Guide](./user/PROVIDER_GUIDE.md) - Guide for healthcare providers
- [Admin User Guide](./user/ADMIN_GUIDE.md) - Guide for platform administrators

### For Compliance & Security
- [HIPAA Compliance](./compliance/HIPAA-COMPLIANCE-CHECKLIST.md) - HIPAA compliance documentation
- [Privacy Policy](./compliance/PRIVACY-POLICY.md) - Privacy policy and data handling
- [Security Documentation](../SECURITY_README.md) - Security practices and guidelines
- [Audit Logging](./compliance/AUDIT-LOGGING-DOCUMENTATION.md) - Audit trail documentation
- [Data Retention Policy](./compliance/DATA-RETENTION-POLICY.md) - Data retention guidelines

## Quick Links

### Getting Started
1. [Quick Start Guide](./developer/QUICKSTART.md) - Get up and running in 15 minutes
2. [Docker Setup](../DOCKER.md) - Containerized development environment
3. [API Setup](../API_SETUP.md) - API service configuration

### Common Tasks
- [Running Tests](./developer/TESTING.md)
- [Database Migrations](./developer/DATABASE.md)
- [Building for Production](./deployment/BUILD.md)
- [Monitoring Logs](./operations/LOGGING.md)

### Integration Guides
- [Stripe Payment Integration](../STRIPE_INTEGRATION.md)
- [Telemedicine Setup](../TELEMEDICINE_IMPLEMENTATION.md)
- [Internationalization](../I18N-SETUP-SUMMARY.md)
- [Accessibility Implementation](../ACCESSIBILITY_IMPLEMENTATION.md)

## Root-Level Documentation

The following documentation files are in the project root:

| Document | Description |
|----------|-------------|
| [README.md](../README.md) | Platform overview, architecture, technology stack |
| [DEPLOYMENT.md](../DEPLOYMENT.md) | AWS EKS deployment guide |
| [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) | Terraform infrastructure deployment |
| [QUICKSTART-DEPLOYMENT.md](../QUICKSTART-DEPLOYMENT.md) | 60-minute deployment guide |
| [BUILD_QUICKSTART.md](../BUILD_QUICKSTART.md) | Build instructions |
| [DOCKER.md](../DOCKER.md) | Docker setup and commands |
| [API_SETUP.md](../API_SETUP.md) | API and SDK setup |
| [DATABASE_SETUP_CHECKLIST.md](../DATABASE_SETUP_CHECKLIST.md) | Database configuration |

## Documentation Structure

```
docs/
├── README.md                          # This file - Documentation index
├── api/                               # API Documentation
│   ├── README.md                      # API overview
│   ├── AUTHENTICATION.md              # Auth guide
│   ├── ENDPOINTS.md                   # Endpoint reference
│   ├── ERROR_CODES.md                 # Error code reference
│   └── EXAMPLES.md                    # Integration examples
├── architecture/                      # Architecture Documentation
│   ├── README.md                      # Architecture overview
│   ├── SYSTEM_DESIGN.md              # System design principles
│   ├── SERVICE_DEPENDENCIES.md        # Service dependency map
│   └── DATA_MODELS.md                # Data architecture
├── developer/                         # Developer Documentation
│   ├── README.md                      # Developer guide overview
│   ├── LOCAL_SETUP.md                # Local development setup
│   ├── CODE_STYLE.md                 # Code style guide
│   ├── CONTRIBUTING.md               # Contributing guidelines
│   ├── TESTING.md                    # Testing guide
│   └── DATABASE.md                   # Database guide
├── deployment/                        # Deployment Documentation
│   ├── README.md                      # Deployment overview
│   ├── INFRASTRUCTURE.md             # Infrastructure setup
│   ├── KUBERNETES.md                 # Kubernetes deployment
│   └── CI_CD.md                      # CI/CD pipeline
├── operations/                        # Operations Documentation
│   ├── README.md                      # Operations overview
│   ├── MONITORING.md                 # Monitoring guide
│   ├── LOGGING.md                    # Logging guide
│   └── TROUBLESHOOTING.md            # Troubleshooting guide
├── user/                              # User Documentation
│   ├── PATIENT_GUIDE.md              # Patient user guide
│   ├── PROVIDER_GUIDE.md             # Provider user guide
│   └── ADMIN_GUIDE.md                # Admin user guide
└── compliance/                        # Compliance Documentation
    ├── HIPAA-COMPLIANCE-CHECKLIST.md
    ├── PRIVACY-POLICY.md
    ├── AUDIT-LOGGING-DOCUMENTATION.md
    └── DATA-RETENTION-POLICY.md
```

## Contributing to Documentation

Documentation is critical to the success of this project. If you find errors, outdated information, or areas that need clarification:

1. Create an issue describing the documentation problem
2. Submit a pull request with improvements
3. Follow the documentation style guide
4. Ensure all links are working
5. Keep code examples up to date

## Documentation Standards

- Use clear, concise language
- Include code examples where applicable
- Keep screenshots up to date
- Cross-reference related documentation
- Update changelog when making significant changes

## Support

For questions about the documentation or platform:
- Technical Support: support@unifiedhealth.io
- Developer Support: developers@unifiedhealth.io
- Documentation Issues: Create an issue in the repository

---

**Last Updated:** 2025-12-17
**Version:** 1.0.0

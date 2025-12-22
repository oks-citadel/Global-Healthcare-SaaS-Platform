# ============================================
# UnifiedHealth Platform - Makefile
# ============================================
# Commands for development and Azure Cloud deployment
# All deployments run on Azure Cloud infrastructure

.PHONY: help install build test lint format clean docker-build docker-push deploy-staging deploy-production rollback setup-azure setup-secrets backup restore logs

# Default target
.DEFAULT_GOAL := help

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

# Configuration
ENVIRONMENT ?= staging
VERSION ?= $(shell git rev-parse --short HEAD)
ACR_NAME ?= acrunifiedhealthdev2
ACR_LOGIN_SERVER := $(ACR_NAME).azurecr.io

##@ Help

help: ## Display this help message
	@echo "$(BLUE)UnifiedHealth Platform - Available Commands$(NC)"
	@echo "$(YELLOW)All deployments run on Azure Cloud$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make $(CYAN)<target>$(NC)\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  $(CYAN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

install: ## Install dependencies for all services
	@echo "$(BLUE)Installing dependencies...$(NC)"
	pnpm install
	@echo "$(GREEN)Dependencies installed!$(NC)"

install-api: ## Install dependencies for API service only
	@echo "$(BLUE)Installing API dependencies...$(NC)"
	cd services/api && pnpm install

install-web: ## Install dependencies for Web app only
	@echo "$(BLUE)Installing Web dependencies...$(NC)"
	cd apps/web && pnpm install

build: ## Build all services
	@echo "$(BLUE)Building all services...$(NC)"
	pnpm build
	@echo "$(GREEN)Build complete!$(NC)"

build-api: ## Build API service only
	@echo "$(BLUE)Building API service...$(NC)"
	cd services/api && pnpm build

build-web: ## Build Web app only
	@echo "$(BLUE)Building Web app...$(NC)"
	cd apps/web && pnpm build

dev: ## Start development servers
	@echo "$(BLUE)Starting development servers...$(NC)"
	pnpm dev

dev-api: ## Start API development server
	@echo "$(BLUE)Starting API dev server...$(NC)"
	cd services/api && pnpm dev

dev-web: ## Start Web development server
	@echo "$(BLUE)Starting Web dev server...$(NC)"
	cd apps/web && pnpm dev

##@ Testing

test: ## Run all tests
	@echo "$(BLUE)Running tests...$(NC)"
	pnpm test

test-api: ## Run API tests
	@echo "$(BLUE)Running API tests...$(NC)"
	cd services/api && pnpm test

test-web: ## Run Web tests
	@echo "$(BLUE)Running Web tests...$(NC)"
	cd apps/web && pnpm test

test-e2e: ## Run E2E tests
	@echo "$(BLUE)Running E2E tests...$(NC)"
	pnpm test:e2e

test-coverage: ## Run tests with coverage
	@echo "$(BLUE)Running tests with coverage...$(NC)"
	pnpm test:coverage

##@ Code Quality

lint: ## Lint all code
	@echo "$(BLUE)Linting code...$(NC)"
	pnpm lint

lint-fix: ## Lint and fix all code
	@echo "$(BLUE)Linting and fixing code...$(NC)"
	pnpm lint:fix

format: ## Format all code
	@echo "$(BLUE)Formatting code...$(NC)"
	pnpm format

format-check: ## Check code formatting
	@echo "$(BLUE)Checking code formatting...$(NC)"
	pnpm format:check

typecheck: ## Type check all code
	@echo "$(BLUE)Type checking code...$(NC)"
	pnpm typecheck

##@ Database

db-generate: ## Generate Prisma client
	@echo "$(BLUE)Generating Prisma client...$(NC)"
	cd services/api && pnpm db:generate

db-migrate: ## Run database migrations
	@echo "$(BLUE)Running database migrations...$(NC)"
	cd services/api && pnpm db:migrate

db-migrate-deploy: ## Deploy database migrations
	@echo "$(BLUE)Deploying database migrations...$(NC)"
	cd services/api && pnpm db:migrate:deploy

db-seed: ## Seed database
	@echo "$(BLUE)Seeding database...$(NC)"
	cd services/api && pnpm db:seed

db-studio: ## Open Prisma Studio
	@echo "$(BLUE)Opening Prisma Studio...$(NC)"
	cd services/api && pnpm db:studio

db-reset: ## Reset database (DANGER: drops all data)
	@echo "$(RED)WARNING: This will drop all data!$(NC)"
	@read -p "Are you sure? (yes/no): " confirm && [ "$$confirm" = "yes" ] || (echo "Cancelled" && exit 1)
	cd services/api && pnpm db:reset

##@ Azure Container Registry

acr-login: ## Login to Azure Container Registry
	@echo "$(BLUE)Logging in to Azure Container Registry...$(NC)"
	az acr login --name $(ACR_NAME)

docker-build-api: ## Build API Docker image for Azure ACR
	@echo "$(BLUE)Building API Docker image...$(NC)"
	docker build -t $(ACR_LOGIN_SERVER)/unified-health-api:$(VERSION) -f services/api/Dockerfile services/api

docker-build-web: ## Build Web Docker image for Azure ACR
	@echo "$(BLUE)Building Web Docker image...$(NC)"
	docker build -t $(ACR_LOGIN_SERVER)/unified-health-web:$(VERSION) -f apps/web/Dockerfile apps/web

docker-build: acr-login docker-build-api docker-build-web ## Build all Docker images for Azure ACR
	@echo "$(GREEN)Docker images built!$(NC)"

docker-push-api: ## Push API Docker image to Azure ACR
	@echo "$(BLUE)Pushing API Docker image to Azure ACR...$(NC)"
	docker push $(ACR_LOGIN_SERVER)/unified-health-api:$(VERSION)

docker-push-web: ## Push Web Docker image to Azure ACR
	@echo "$(BLUE)Pushing Web Docker image to Azure ACR...$(NC)"
	docker push $(ACR_LOGIN_SERVER)/unified-health-web:$(VERSION)

docker-push: acr-login docker-push-api docker-push-web ## Push all Docker images to Azure ACR
	@echo "$(GREEN)Docker images pushed to Azure ACR!$(NC)"

##@ Azure Infrastructure

azure-login: ## Login to Azure CLI
	@echo "$(BLUE)Logging in to Azure...$(NC)"
	az login

setup-azure-staging: ## Setup Azure infrastructure for staging
	@echo "$(BLUE)Setting up Azure infrastructure for staging...$(NC)"
	./scripts/setup-azure.sh staging

setup-azure-production: ## Setup Azure infrastructure for production
	@echo "$(BLUE)Setting up Azure infrastructure for production...$(NC)"
	./scripts/setup-azure.sh production

setup-secrets-staging: ## Setup Kubernetes secrets for staging
	@echo "$(BLUE)Setting up secrets for staging...$(NC)"
	./scripts/setup-secrets.sh staging

setup-secrets-production: ## Setup Kubernetes secrets for production
	@echo "$(BLUE)Setting up secrets for production...$(NC)"
	./scripts/setup-secrets.sh production

##@ Azure Deployment

deploy-staging: ## Deploy to staging on Azure AKS
	@echo "$(BLUE)Deploying to Azure staging...$(NC)"
	./scripts/deploy-staging.sh

deploy-production: ## Deploy to production on Azure AKS (requires confirmation)
	@echo "$(RED)WARNING: Deploying to Azure PRODUCTION$(NC)"
	./scripts/deploy-production.sh

rollback-staging: ## Rollback staging deployment on Azure
	@echo "$(YELLOW)Rolling back Azure staging...$(NC)"
	./scripts/rollback.sh staging

rollback-production: ## Rollback production deployment on Azure
	@echo "$(RED)Rolling back Azure production...$(NC)"
	./scripts/rollback.sh production

##@ Azure Database Operations

backup-staging: ## Backup staging database on Azure
	@echo "$(BLUE)Backing up Azure staging database...$(NC)"
	./scripts/db-backup.sh staging

backup-production: ## Backup production database on Azure
	@echo "$(BLUE)Backing up Azure production database...$(NC)"
	./scripts/db-backup.sh production

restore-staging: ## Restore staging database on Azure (requires backup name)
	@echo "$(YELLOW)Restoring Azure staging database...$(NC)"
	@read -p "Enter backup name: " backup && ./scripts/db-restore.sh $$backup staging

restore-production: ## Restore production database on Azure (requires backup name)
	@echo "$(RED)WARNING: Restoring Azure PRODUCTION database$(NC)"
	@read -p "Enter backup name: " backup && ./scripts/db-restore.sh $$backup production

##@ Azure Kubernetes Service (AKS)

aks-context-staging: ## Switch to Azure AKS staging context
	@echo "$(BLUE)Switching to Azure AKS staging context...$(NC)"
	az aks get-credentials --resource-group unified-health-rg-staging --name unified-health-aks-staging

aks-context-production: ## Switch to Azure AKS production context
	@echo "$(BLUE)Switching to Azure AKS production context...$(NC)"
	az aks get-credentials --resource-group unified-health-rg-prod --name unified-health-aks-prod

aks-pods-staging: ## List staging pods on Azure AKS
	kubectl get pods -n unified-health-staging

aks-pods-production: ## List production pods on Azure AKS
	kubectl get pods -n unified-health-prod

aks-logs-staging: ## View staging API logs on Azure AKS
	kubectl logs -f -n unified-health-staging -l app=unified-health-api --tail=100

aks-logs-production: ## View production API logs on Azure AKS
	kubectl logs -f -n unified-health-prod -l app=unified-health-api --tail=100

aks-shell-staging: ## Open shell in staging pod on Azure AKS
	@echo "$(BLUE)Opening shell in Azure staging pod...$(NC)"
	kubectl exec -it -n unified-health-staging $$(kubectl get pod -n unified-health-staging -l app=unified-health-api -o jsonpath='{.items[0].metadata.name}') -- /bin/sh

aks-shell-production: ## Open shell in production pod on Azure AKS
	@echo "$(BLUE)Opening shell in Azure production pod...$(NC)"
	kubectl exec -it -n unified-health-prod $$(kubectl get pod -n unified-health-prod -l app=unified-health-api -o jsonpath='{.items[0].metadata.name}') -- /bin/sh

aks-describe-staging: ## Describe staging deployment on Azure AKS
	kubectl describe deployment unified-health-api -n unified-health-staging

aks-describe-production: ## Describe production deployment on Azure AKS
	kubectl describe deployment unified-health-api -n unified-health-prod

##@ Azure Container Apps

containerapp-logs-staging: ## View staging logs on Azure Container Apps
	az containerapp logs show --name unifiedhealth-staging-api --resource-group unifiedhealth-rg-staging --follow

containerapp-logs-production: ## View production logs on Azure Container Apps
	az containerapp logs show --name unifiedhealth-prod-api --resource-group unifiedhealth-rg-prod --follow

containerapp-restart-staging: ## Restart staging Container App
	az containerapp revision restart --name unifiedhealth-staging-api --resource-group unifiedhealth-rg-staging

containerapp-restart-production: ## Restart production Container App
	az containerapp revision restart --name unifiedhealth-prod-api --resource-group unifiedhealth-rg-prod

##@ Azure Monitoring

status-staging: ## Check staging status on Azure
	@echo "$(BLUE)Azure Staging Status:$(NC)"
	@kubectl get pods -n unified-health-staging || az containerapp show --name unifiedhealth-staging-api --resource-group unifiedhealth-rg-staging --query "{Name:name, Status:properties.runningStatus}" -o table
	@kubectl get svc -n unified-health-staging 2>/dev/null || true
	@kubectl get ingress -n unified-health-staging 2>/dev/null || true

status-production: ## Check production status on Azure
	@echo "$(BLUE)Azure Production Status:$(NC)"
	@kubectl get pods -n unified-health-prod || az containerapp show --name unifiedhealth-prod-api --resource-group unifiedhealth-rg-prod --query "{Name:name, Status:properties.runningStatus}" -o table
	@kubectl get svc -n unified-health-prod 2>/dev/null || true
	@kubectl get ingress -n unified-health-prod 2>/dev/null || true

metrics-staging: ## View staging metrics on Azure AKS
	kubectl top pods -n unified-health-staging

metrics-production: ## View production metrics on Azure AKS
	kubectl top pods -n unified-health-prod

##@ Utilities

clean: ## Clean build artifacts and dependencies
	@echo "$(BLUE)Cleaning...$(NC)"
	find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
	find . -name "dist" -type d -prune -exec rm -rf '{}' +
	find . -name ".next" -type d -prune -exec rm -rf '{}' +
	find . -name ".turbo" -type d -prune -exec rm -rf '{}' +
	@echo "$(GREEN)Clean complete!$(NC)"

version: ## Show current version
	@echo "Version: $(VERSION)"

info: ## Show project information
	@echo "$(BLUE)UnifiedHealth Platform$(NC)"
	@echo "Version: $(VERSION)"
	@echo "Environment: $(ENVIRONMENT)"
	@echo "ACR: $(ACR_LOGIN_SERVER)"
	@echo ""
	@echo "Git branch: $$(git branch --show-current)"
	@echo "Git commit: $$(git rev-parse HEAD)"

check-env: ## Check environment setup for Azure
	@echo "$(BLUE)Checking environment for Azure Cloud...$(NC)"
	@command -v node >/dev/null 2>&1 || (echo "$(RED)Node.js not found$(NC)" && exit 1)
	@command -v pnpm >/dev/null 2>&1 || (echo "$(RED)pnpm not found$(NC)" && exit 1)
	@command -v docker >/dev/null 2>&1 || (echo "$(RED)Docker not found$(NC)" && exit 1)
	@command -v kubectl >/dev/null 2>&1 || (echo "$(RED)kubectl not found$(NC)" && exit 1)
	@command -v az >/dev/null 2>&1 || (echo "$(RED)Azure CLI not found$(NC)" && exit 1)
	@az account show >/dev/null 2>&1 || (echo "$(YELLOW)Not logged in to Azure. Run 'make azure-login'$(NC)")
	@echo "$(GREEN)All required tools are installed!$(NC)"

##@ CI/CD (GitHub Actions)

ci-install: ## CI: Install dependencies
	pnpm install --frozen-lockfile

ci-build: ## CI: Build all services
	pnpm build

ci-test: ## CI: Run all tests
	pnpm test
	pnpm test:e2e

ci-lint: ## CI: Lint and type check
	pnpm lint
	pnpm typecheck

ci-docker: ## CI: Build and push Docker images to Azure ACR
	$(MAKE) docker-build
	$(MAKE) docker-push

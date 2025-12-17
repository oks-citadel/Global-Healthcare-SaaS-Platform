# ============================================
# UnifiedHealth Platform - Makefile
# ============================================
# Common commands for development and deployment

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
ACR_NAME ?= unifiedhealthacr
ACR_LOGIN_SERVER := $(ACR_NAME).azurecr.io

##@ Help

help: ## Display this help message
	@echo "$(BLUE)UnifiedHealth Platform - Available Commands$(NC)"
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

##@ Docker

docker-build: ## Build all Docker images using build script
	@echo "$(BLUE)Building Docker images...$(NC)"
	./scripts/docker-build.sh
	@echo "$(GREEN)Docker images built!$(NC)"

docker-build-api: ## Build API Docker image
	@echo "$(BLUE)Building API Docker image...$(NC)"
	docker build -t $(ACR_LOGIN_SERVER)/unified-health-api:$(VERSION) -f services/api/Dockerfile services/api

docker-build-web: ## Build Web Docker image
	@echo "$(BLUE)Building Web Docker image...$(NC)"
	docker build -t $(ACR_LOGIN_SERVER)/unified-health-web:$(VERSION) -f apps/web/Dockerfile apps/web

docker-build-mobile: ## Build Mobile Docker image
	@echo "$(BLUE)Building Mobile Docker image...$(NC)"
	docker build -t $(ACR_LOGIN_SERVER)/unified-health-mobile:$(VERSION) -f apps/mobile/Dockerfile apps/mobile

docker-push: ## Push Docker images to ACR using build script
	@echo "$(BLUE)Pushing Docker images to ACR...$(NC)"
	PUSH=true ./scripts/docker-build.sh
	@echo "$(GREEN)Docker images pushed!$(NC)"

docker-up: ## Start development environment with Docker Compose
	@echo "$(BLUE)Starting development environment...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)Services started!$(NC)"
	@echo "API: http://localhost:8080"
	@echo "Web: http://localhost:3000"

docker-down: ## Stop Docker Compose environment
	@echo "$(BLUE)Stopping Docker Compose...$(NC)"
	docker-compose down

docker-logs: ## View Docker Compose logs
	docker-compose logs -f

docker-prod-up: ## Start production-like environment
	@echo "$(BLUE)Starting production environment...$(NC)"
	docker-compose -f docker-compose.prod.yml up -d
	@echo "$(GREEN)Production services started!$(NC)"

docker-prod-down: ## Stop production environment
	docker-compose -f docker-compose.prod.yml down

docker-health: ## Check health of all Docker services
	@echo "$(BLUE)Checking service health...$(NC)"
	./scripts/docker-health-check.sh

docker-restart: ## Restart all Docker services
	docker-compose restart

docker-clean: ## Remove all containers, volumes, and images
	@echo "$(YELLOW)WARNING: This will remove all Docker resources!$(NC)"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ]
	docker-compose down -v
	docker system prune -af

docker-shell-api: ## Open shell in API container
	docker-compose exec api sh

docker-shell-web: ## Open shell in Web container
	docker-compose exec web sh

docker-stats: ## Show Docker resource usage statistics
	docker stats --no-stream

##@ Azure Infrastructure

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

##@ Deployment

deploy-staging: ## Deploy to staging
	@echo "$(BLUE)Deploying to staging...$(NC)"
	./scripts/deploy-staging.sh

deploy-production: ## Deploy to production (requires confirmation)
	@echo "$(RED)WARNING: Deploying to PRODUCTION$(NC)"
	./scripts/deploy-production.sh

rollback-staging: ## Rollback staging deployment
	@echo "$(YELLOW)Rolling back staging...$(NC)"
	./scripts/rollback.sh staging

rollback-production: ## Rollback production deployment
	@echo "$(RED)Rolling back production...$(NC)"
	./scripts/rollback.sh production

##@ Database Operations

backup-staging: ## Backup staging database
	@echo "$(BLUE)Backing up staging database...$(NC)"
	./scripts/db-backup.sh staging

backup-production: ## Backup production database
	@echo "$(BLUE)Backing up production database...$(NC)"
	./scripts/db-backup.sh production

restore-staging: ## Restore staging database (requires backup name)
	@echo "$(YELLOW)Restoring staging database...$(NC)"
	@read -p "Enter backup name: " backup && ./scripts/db-restore.sh $$backup staging

restore-production: ## Restore production database (requires backup name)
	@echo "$(RED)WARNING: Restoring PRODUCTION database$(NC)"
	@read -p "Enter backup name: " backup && ./scripts/db-restore.sh $$backup production

##@ Kubernetes

k8s-context-staging: ## Switch to staging Kubernetes context
	@echo "$(BLUE)Switching to staging context...$(NC)"
	az aks get-credentials --resource-group unified-health-rg-staging --name unified-health-aks-staging

k8s-context-production: ## Switch to production Kubernetes context
	@echo "$(BLUE)Switching to production context...$(NC)"
	az aks get-credentials --resource-group unified-health-rg-prod --name unified-health-aks-prod

k8s-pods-staging: ## List staging pods
	kubectl get pods -n unified-health-staging

k8s-pods-production: ## List production pods
	kubectl get pods -n unified-health-prod

k8s-logs-staging: ## View staging API logs
	kubectl logs -f -n unified-health-staging -l app=unified-health-api --tail=100

k8s-logs-production: ## View production API logs
	kubectl logs -f -n unified-health-prod -l app=unified-health-api --tail=100

k8s-shell-staging: ## Open shell in staging pod
	@echo "$(BLUE)Opening shell in staging pod...$(NC)"
	kubectl exec -it -n unified-health-staging $$(kubectl get pod -n unified-health-staging -l app=unified-health-api -o jsonpath='{.items[0].metadata.name}') -- /bin/sh

k8s-shell-production: ## Open shell in production pod
	@echo "$(BLUE)Opening shell in production pod...$(NC)"
	kubectl exec -it -n unified-health-prod $$(kubectl get pod -n unified-health-prod -l app=unified-health-api -o jsonpath='{.items[0].metadata.name}') -- /bin/sh

k8s-describe-staging: ## Describe staging deployment
	kubectl describe deployment unified-health-api -n unified-health-staging

k8s-describe-production: ## Describe production deployment
	kubectl describe deployment unified-health-api -n unified-health-prod

##@ Monitoring

logs-staging: ## View staging logs
	@echo "$(BLUE)Viewing staging logs...$(NC)"
	kubectl logs -f -n unified-health-staging -l app=unified-health-api --tail=100

logs-production: ## View production logs
	@echo "$(BLUE)Viewing production logs...$(NC)"
	kubectl logs -f -n unified-health-prod -l app=unified-health-api --tail=100

status-staging: ## Check staging status
	@echo "$(BLUE)Staging Status:$(NC)"
	@kubectl get pods -n unified-health-staging
	@kubectl get svc -n unified-health-staging
	@kubectl get ingress -n unified-health-staging

status-production: ## Check production status
	@echo "$(BLUE)Production Status:$(NC)"
	@kubectl get pods -n unified-health-prod
	@kubectl get svc -n unified-health-prod
	@kubectl get ingress -n unified-health-prod

metrics-staging: ## View staging metrics
	kubectl top pods -n unified-health-staging

metrics-production: ## View production metrics
	kubectl top pods -n unified-health-prod

##@ Utilities

clean: ## Clean build artifacts and dependencies
	@echo "$(BLUE)Cleaning...$(NC)"
	find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
	find . -name "dist" -type d -prune -exec rm -rf '{}' +
	find . -name ".next" -type d -prune -exec rm -rf '{}' +
	find . -name ".turbo" -type d -prune -exec rm -rf '{}' +
	@echo "$(GREEN)Clean complete!$(NC)"

clean-docker: ## Clean Docker images and containers
	@echo "$(BLUE)Cleaning Docker...$(NC)"
	docker system prune -af --volumes

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

check-env: ## Check environment setup
	@echo "$(BLUE)Checking environment...$(NC)"
	@command -v node >/dev/null 2>&1 || (echo "$(RED)Node.js not found$(NC)" && exit 1)
	@command -v pnpm >/dev/null 2>&1 || (echo "$(RED)pnpm not found$(NC)" && exit 1)
	@command -v docker >/dev/null 2>&1 || (echo "$(RED)Docker not found$(NC)" && exit 1)
	@command -v kubectl >/dev/null 2>&1 || (echo "$(RED)kubectl not found$(NC)" && exit 1)
	@command -v az >/dev/null 2>&1 || (echo "$(RED)Azure CLI not found$(NC)" && exit 1)
	@echo "$(GREEN)All required tools are installed!$(NC)"

##@ CI/CD

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

ci-docker: ## CI: Build and push Docker images
	$(MAKE) docker-build
	$(MAKE) docker-push

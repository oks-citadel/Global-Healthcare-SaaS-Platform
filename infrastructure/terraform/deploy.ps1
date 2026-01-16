# ============================================
# Terraform Infrastructure Deployment Script (PowerShell)
# ============================================
# Deploys Azure infrastructure for UnifiedHealth Platform
# Supports dev, staging, and prod environments

[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('dev', 'staging', 'prod')]
    [string]$Environment,

    [Parameter(Mandatory=$false)]
    [ValidateSet('plan', 'apply', 'destroy')]
    [string]$Action = 'plan',

    [Parameter(Mandatory=$false)]
    [switch]$AutoApprove,

    [Parameter(Mandatory=$false)]
    [switch]$Help
)

# ============================================
# Helper Functions
# ============================================

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Type = 'Info'
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

    switch ($Type) {
        'Info' { Write-Host "[$timestamp] [INFO] $Message" -ForegroundColor Blue }
        'Success' { Write-Host "[$timestamp] [SUCCESS] $Message" -ForegroundColor Green }
        'Warning' { Write-Host "[$timestamp] [WARNING] $Message" -ForegroundColor Yellow }
        'Error' { Write-Host "[$timestamp] [ERROR] $Message" -ForegroundColor Red }
    }
}

function Show-Usage {
    @"
Usage: .\deploy.ps1 -Environment <ENV> [-Action <ACTION>] [-AutoApprove] [-Help]

Deploy Azure infrastructure using Terraform

PARAMETERS:
    -Environment <ENV>      Environment to deploy (dev, staging, prod) [REQUIRED]
    -Action <ACTION>        Action to perform (plan, apply, destroy) [Default: plan]
    -AutoApprove           Auto-approve (skip confirmation)
    -Help                  Show this help message

EXAMPLES:
    .\deploy.ps1 -Environment dev -Action plan
    .\deploy.ps1 -Environment staging -Action apply
    .\deploy.ps1 -Environment prod -Action apply -AutoApprove

PREREQUISITES:
    - Azure CLI installed and authenticated (az login)
    - Terraform >= 1.6.0 installed
    - Environment variable files configured in environments/ directory
    - Azure Storage account created for Terraform state
"@
}

function Test-Prerequisites {
    Write-ColorOutput "Checking prerequisites..." -Type Info

    # Check Azure CLI
    if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
        Write-ColorOutput "Azure CLI is not installed. Please install it first." -Type Error
        Write-ColorOutput "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -Type Info
        exit 1
    }

    # Check Azure authentication
    try {
        $null = az account show 2>$null
    }
    catch {
        Write-ColorOutput "Not logged in to Azure. Please run 'az login' first." -Type Error
        exit 1
    }

    # Check Terraform
    if (-not (Get-Command terraform -ErrorAction SilentlyContinue)) {
        Write-ColorOutput "Terraform is not installed. Please install it first." -Type Error
        Write-ColorOutput "Visit: https://www.terraform.io/downloads" -Type Info
        exit 1
    }

    # Check Terraform version
    $terraformVersionOutput = terraform version -json | ConvertFrom-Json
    $terraformVersion = [Version]$terraformVersionOutput.terraform_version
    $requiredVersion = [Version]"1.6.0"

    if ($terraformVersion -lt $requiredVersion) {
        Write-ColorOutput "Terraform version $requiredVersion or higher is required. Current: $terraformVersion" -Type Error
        exit 1
    }

    Write-ColorOutput "All prerequisites met" -Type Success
}

function Test-EnvironmentFiles {
    param([string]$Env)

    $envDir = Join-Path $PSScriptRoot "environments"
    $tfvarsFile = Join-Path $envDir "$Env.tfvars"
    $backendFile = Join-Path $envDir "$Env.tfbackend"

    if (-not (Test-Path $tfvarsFile)) {
        Write-ColorOutput "Environment file not found: $tfvarsFile" -Type Error
        exit 1
    }

    if (-not (Test-Path $backendFile)) {
        Write-ColorOutput "Backend configuration file not found: $backendFile" -Type Error
        exit 1
    }

    Write-ColorOutput "Environment files validated" -Type Success
}

function Initialize-TerraformBackend {
    param([string]$Env)

    Write-ColorOutput "Setting up Terraform backend for $Env environment..." -Type Info

    $envDir = Join-Path $PSScriptRoot "environments"
    $backendFile = Join-Path $envDir "$Env.tfbackend"

    terraform init -backend-config="$backendFile" -reconfigure

    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "Failed to initialize Terraform backend" -Type Error
        exit 1
    }

    Write-ColorOutput "Backend configured successfully" -Type Success
}

function Invoke-TerraformPlan {
    param([string]$Env)

    Write-ColorOutput "Running Terraform plan for $Env environment..." -Type Info

    $envDir = Join-Path $PSScriptRoot "environments"
    $tfvarsFile = Join-Path $envDir "$Env.tfvars"
    $planFile = "$Env.tfplan"

    terraform plan -var-file="$tfvarsFile" -out="$planFile"

    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "Terraform plan failed" -Type Error
        exit 1
    }

    Write-ColorOutput "Plan saved to $planFile" -Type Success
}

function Invoke-TerraformApply {
    param(
        [string]$Env,
        [bool]$AutoApprove
    )

    Write-ColorOutput "Applying Terraform changes for $Env environment..." -Type Info

    $planFile = "$Env.tfplan"

    if ($AutoApprove) {
        terraform apply -auto-approve "$planFile"
    }
    else {
        terraform apply "$planFile"
    }

    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "Terraform apply failed" -Type Error
        exit 1
    }

    Write-ColorOutput "Infrastructure deployed successfully" -Type Success

    # Show outputs
    Write-ColorOutput "Infrastructure outputs:" -Type Info
    terraform output
}

function Invoke-TerraformDestroy {
    param(
        [string]$Env,
        [bool]$AutoApprove
    )

    Write-ColorOutput "This will destroy ALL infrastructure in $Env environment!" -Type Warning

    if ($Env -eq 'prod') {
        Write-ColorOutput "Production destruction requires manual confirmation" -Type Error
        $confirmation = Read-Host "Type 'destroy-prod' to confirm"
        if ($confirmation -ne 'destroy-prod') {
            Write-ColorOutput "Destruction cancelled" -Type Info
            exit 0
        }
    }

    $envDir = Join-Path $PSScriptRoot "environments"
    $tfvarsFile = Join-Path $envDir "$Env.tfvars"

    if ($AutoApprove) {
        terraform destroy -var-file="$tfvarsFile" -auto-approve
    }
    else {
        terraform destroy -var-file="$tfvarsFile"
    }

    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "Terraform destroy failed" -Type Error
        exit 1
    }

    Write-ColorOutput "Infrastructure destroyed successfully" -Type Success
}

function Test-TerraformConfiguration {
    Write-ColorOutput "Validating Terraform configuration..." -Type Info

    terraform validate

    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "Terraform validation failed" -Type Error
        exit 1
    }

    Write-ColorOutput "Terraform configuration is valid" -Type Success
}

function Format-TerraformFiles {
    Write-ColorOutput "Formatting Terraform files..." -Type Info

    terraform fmt -recursive

    Write-ColorOutput "Terraform files formatted" -Type Success
}

function Show-DeploymentSummary {
    param(
        [string]$Env,
        [string]$Action
    )

    $subscription = az account show --query name -o tsv
    $terraformVersionOutput = terraform version -json | ConvertFrom-Json
    $terraformVersion = $terraformVersionOutput.terraform_version

    Write-Host "`n============================================" -ForegroundColor Cyan
    Write-Host "Deployment Summary" -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "Environment: $Env" -ForegroundColor White
    Write-Host "Action: $Action" -ForegroundColor White
    Write-Host "Azure Subscription: $subscription" -ForegroundColor White
    Write-Host "Terraform Version: $terraformVersion" -ForegroundColor White
    Write-Host "============================================`n" -ForegroundColor Cyan
}

# ============================================
# Main Script
# ============================================

if ($Help) {
    Show-Usage
    exit 0
}

try {
    # Show summary
    Show-DeploymentSummary -Env $Environment -Action $Action

    # Change to script directory
    Set-Location $PSScriptRoot

    # Run checks
    Test-Prerequisites
    Test-EnvironmentFiles -Env $Environment

    # Format and validate
    Format-TerraformFiles
    Test-TerraformConfiguration

    # Setup backend
    Initialize-TerraformBackend -Env $Environment

    # Execute action
    switch ($Action) {
        'plan' {
            Invoke-TerraformPlan -Env $Environment
        }
        'apply' {
            Invoke-TerraformPlan -Env $Environment
            Invoke-TerraformApply -Env $Environment -AutoApprove $AutoApprove
        }
        'destroy' {
            Invoke-TerraformDestroy -Env $Environment -AutoApprove $AutoApprove
        }
    }

    Write-ColorOutput "Deployment script completed successfully!" -Type Success
}
catch {
    Write-ColorOutput "Deployment failed: $_" -Type Error
    exit 1
}

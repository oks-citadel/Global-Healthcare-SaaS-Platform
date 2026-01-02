# ============================================
# The Unified Health - AWS Deployment Script (PowerShell)
# ============================================
# Domain: theunifiedhealth.com
# ============================================

param(
    [Parameter(Position=0)]
    [ValidateSet("check", "init", "deploy", "outputs", "kubectl", "trigger", "full")]
    [string]$Command = "deploy"
)

$ErrorActionPreference = "Stop"

function Write-Header {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Blue
    Write-Host "  The Unified Health - AWS Deployment" -ForegroundColor Blue
    Write-Host "  Domain: theunifiedhealth.com" -ForegroundColor Blue
    Write-Host "============================================" -ForegroundColor Blue
    Write-Host ""
}

function Check-Prerequisites {
    Write-Host "Checking prerequisites..." -ForegroundColor Yellow

    # Check AWS CLI
    if (!(Get-Command aws -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: AWS CLI not installed" -ForegroundColor Red
        exit 1
    }

    # Check Terraform
    if (!(Get-Command terraform -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: Terraform not installed" -ForegroundColor Red
        exit 1
    }

    # Check kubectl
    if (!(Get-Command kubectl -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: kubectl not installed" -ForegroundColor Red
        exit 1
    }

    # Check AWS credentials
    try {
        aws sts get-caller-identity | Out-Null
    } catch {
        Write-Host "ERROR: AWS credentials not configured" -ForegroundColor Red
        exit 1
    }

    Write-Host "All prerequisites met!" -ForegroundColor Green
}

function Initialize-Git {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow

    if (!(Test-Path ".git")) {
        git init
        Write-Host "Git repository initialized" -ForegroundColor Green
    } else {
        Write-Host "Git repository already exists" -ForegroundColor Blue
    }
}

function Deploy-Infrastructure {
    Write-Host "Deploying AWS infrastructure..." -ForegroundColor Yellow

    Push-Location "infrastructure/terraform-aws"

    try {
        # Initialize Terraform
        terraform init

        # Plan
        Write-Host "Creating Terraform plan..." -ForegroundColor Blue
        terraform plan -out=tfplan

        # Apply
        Write-Host "Applying Terraform configuration..." -ForegroundColor Yellow
        Write-Host "This may take 30-45 minutes..." -ForegroundColor Yellow
        terraform apply tfplan
    } finally {
        Pop-Location
    }
}

function Get-DeploymentOutputs {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  DEPLOYMENT COMPLETE!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""

    Push-Location "infrastructure/terraform-aws"

    try {
        Write-Host "Route53 Nameservers for GoDaddy:" -ForegroundColor Blue
        Write-Host ""
        $nameservers = terraform output -json route53_nameservers | ConvertFrom-Json
        foreach ($ns in $nameservers) {
            Write-Host "  $ns" -ForegroundColor Green
        }
        Write-Host ""

        Write-Host "EKS Cluster Endpoint:" -ForegroundColor Blue
        terraform output americas_eks_cluster_endpoint

        Write-Host "CodePipeline Name:" -ForegroundColor Blue
        terraform output codepipeline_name
    } finally {
        Pop-Location
    }

    Write-Host ""
    Write-Host "============================================" -ForegroundColor Yellow
    Write-Host "  NEXT STEPS:" -ForegroundColor Yellow
    Write-Host "============================================" -ForegroundColor Yellow
    Write-Host "1. Copy the nameservers above"
    Write-Host "2. Log in to GoDaddy"
    Write-Host "3. Go to: Domains -> theunifiedhealth.com -> DNS -> Nameservers"
    Write-Host "4. Select 'I'll use my own nameservers'"
    Write-Host "5. Enter the 4 AWS nameservers"
    Write-Host "6. Save and wait 24-48 hours for propagation"
    Write-Host "============================================" -ForegroundColor Yellow
    Write-Host ""
}

function Configure-Kubectl {
    Write-Host "Configuring kubectl..." -ForegroundColor Yellow

    Push-Location "infrastructure/terraform-aws"
    try {
        $clusterName = terraform output -raw americas_eks_cluster_name
        if ($clusterName) {
            aws eks update-kubeconfig --name $clusterName --region us-east-1
            Write-Host "kubectl configured for cluster: $clusterName" -ForegroundColor Green
        }
    } finally {
        Pop-Location
    }
}

function Start-Pipeline {
    Write-Host "Triggering CodePipeline..." -ForegroundColor Yellow

    Push-Location "infrastructure/terraform-aws"
    try {
        $pipelineName = terraform output -raw codepipeline_name
        if ($pipelineName) {
            aws codepipeline start-pipeline-execution --name $pipelineName --region us-east-1
            Write-Host "Pipeline triggered: $pipelineName" -ForegroundColor Green
        }
    } finally {
        Pop-Location
    }
}

# Main execution
Write-Header

switch ($Command) {
    "check" {
        Check-Prerequisites
    }
    "init" {
        Check-Prerequisites
        Initialize-Git
    }
    "deploy" {
        Check-Prerequisites
        Deploy-Infrastructure
        Get-DeploymentOutputs
    }
    "outputs" {
        Get-DeploymentOutputs
    }
    "kubectl" {
        Configure-Kubectl
    }
    "trigger" {
        Start-Pipeline
    }
    "full" {
        Check-Prerequisites
        Initialize-Git
        Deploy-Infrastructure
        Configure-Kubectl
        Get-DeploymentOutputs
    }
}

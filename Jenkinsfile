// ============================================
// UnifiedHealth Platform - CD Pipeline
// Jenkins for Continuous Deployment
// ============================================

pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: kubectl
    image: bitnami/kubectl:latest
    command: ['cat']
    tty: true
  - name: terraform
    image: hashicorp/terraform:1.6.0
    command: ['cat']
    tty: true
  - name: helm
    image: alpine/helm:latest
    command: ['cat']
    tty: true
'''
        }
    }

    environment {
        ACR_NAME = credentials('acr-name')
        ACR_LOGIN_SERVER = credentials('acr-login-server')
        AKS_RESOURCE_GROUP = credentials('aks-resource-group')
        AKS_CLUSTER_NAME = credentials('aks-cluster-name')
        AZURE_CREDENTIALS = credentials('azure-credentials')
    }

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['staging', 'production'],
            description: 'Target deployment environment'
        )
        string(
            name: 'IMAGE_TAG',
            defaultValue: 'latest',
            description: 'Docker image tag to deploy'
        )
        booleanParam(
            name: 'RUN_TERRAFORM',
            defaultValue: false,
            description: 'Run Terraform apply for infrastructure changes'
        )
        booleanParam(
            name: 'SKIP_APPROVAL',
            defaultValue: false,
            description: 'Skip manual approval for production (NOT RECOMMENDED)'
        )
    }

    stages {
        // ==========================================
        // Pre-flight Checks
        // ==========================================
        stage('Pre-flight Checks') {
            steps {
                script {
                    echo "Deploying to: ${params.ENVIRONMENT}"
                    echo "Image tag: ${params.IMAGE_TAG}"

                    // Validate image exists
                    container('kubectl') {
                        sh '''
                            az login --service-principal -u $AZURE_CREDENTIALS_USR -p $AZURE_CREDENTIALS_PSW --tenant $AZURE_TENANT_ID
                            az acr repository show-tags --name $ACR_NAME --repository unified-health-api | grep -q "${IMAGE_TAG}" || exit 1
                        '''
                    }
                }
            }
        }

        // ==========================================
        // Terraform Apply (Optional)
        // ==========================================
        stage('Terraform Apply') {
            when {
                expression { params.RUN_TERRAFORM == true }
            }
            steps {
                container('terraform') {
                    dir('infrastructure/terraform') {
                        sh '''
                            terraform init
                            terraform workspace select ${ENVIRONMENT} || terraform workspace new ${ENVIRONMENT}
                            terraform plan -var-file=environments/${ENVIRONMENT}.tfvars -out=tfplan
                            terraform apply tfplan
                        '''
                    }
                }
            }
        }

        // ==========================================
        // Deploy to Staging
        // ==========================================
        stage('Deploy to Staging') {
            when {
                expression { params.ENVIRONMENT == 'staging' }
            }
            steps {
                container('kubectl') {
                    sh '''
                        # Get AKS credentials
                        az aks get-credentials --resource-group $AKS_RESOURCE_GROUP --name $AKS_CLUSTER_NAME-staging --overwrite-existing

                        # Apply Kubernetes manifests
                        kubectl apply -f infrastructure/kubernetes/base/namespace.yaml

                        # Update image tag
                        kubectl set image deployment/unified-health-api \
                            api=$ACR_LOGIN_SERVER/unified-health-api:$IMAGE_TAG \
                            -n unified-health-staging

                        # Wait for rollout
                        kubectl rollout status deployment/unified-health-api -n unified-health-staging --timeout=300s
                    '''
                }
            }
        }

        // ==========================================
        // Integration Tests (Staging)
        // ==========================================
        stage('Staging Integration Tests') {
            when {
                expression { params.ENVIRONMENT == 'staging' }
            }
            steps {
                container('kubectl') {
                    sh '''
                        # Run smoke tests against staging
                        STAGING_URL=$(kubectl get svc unified-health-api -n unified-health-staging -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

                        # Health check
                        curl -f http://$STAGING_URL/health || exit 1

                        # Ready check
                        curl -f http://$STAGING_URL/ready || exit 1

                        echo "Staging smoke tests passed!"
                    '''
                }
            }
        }

        // ==========================================
        // Production Approval
        // ==========================================
        stage('Production Approval') {
            when {
                allOf {
                    expression { params.ENVIRONMENT == 'production' }
                    expression { params.SKIP_APPROVAL == false }
                }
            }
            steps {
                timeout(time: 30, unit: 'MINUTES') {
                    input message: 'Deploy to Production?',
                          ok: 'Deploy',
                          submitterParameter: 'APPROVER'
                }
            }
        }

        // ==========================================
        // Deploy to Production (Blue-Green)
        // ==========================================
        stage('Deploy to Production') {
            when {
                expression { params.ENVIRONMENT == 'production' }
            }
            steps {
                container('kubectl') {
                    sh '''
                        # Get AKS credentials
                        az aks get-credentials --resource-group $AKS_RESOURCE_GROUP --name $AKS_CLUSTER_NAME-prod --overwrite-existing

                        # Blue-Green deployment
                        # Deploy to green (inactive)
                        kubectl apply -f infrastructure/kubernetes/overlays/production/

                        # Update green deployment with new image
                        kubectl set image deployment/unified-health-api-green \
                            api=$ACR_LOGIN_SERVER/unified-health-api:$IMAGE_TAG \
                            -n unified-health-prod

                        # Wait for green rollout
                        kubectl rollout status deployment/unified-health-api-green -n unified-health-prod --timeout=300s

                        # Run health checks on green
                        GREEN_POD=$(kubectl get pods -n unified-health-prod -l app=unified-health-api-green -o jsonpath='{.items[0].metadata.name}')
                        kubectl exec $GREEN_POD -n unified-health-prod -- wget -q --spider http://localhost:8080/health || exit 1

                        # Switch traffic to green
                        kubectl patch service unified-health-api -n unified-health-prod -p '{"spec":{"selector":{"version":"green"}}}'

                        echo "Production deployment complete!"
                    '''
                }
            }
        }

        // ==========================================
        // Post-Deploy Verification
        // ==========================================
        stage('Post-Deploy Verification') {
            steps {
                container('kubectl') {
                    sh '''
                        # Verify deployment health
                        NAMESPACE="unified-health-${ENVIRONMENT}"

                        # Check pod status
                        kubectl get pods -n $NAMESPACE -l app=unified-health-api

                        # Check service endpoints
                        kubectl get endpoints unified-health-api -n $NAMESPACE

                        # Verify metrics endpoint
                        API_POD=$(kubectl get pods -n $NAMESPACE -l app=unified-health-api -o jsonpath='{.items[0].metadata.name}')
                        kubectl exec $API_POD -n $NAMESPACE -- wget -q -O- http://localhost:8080/health

                        echo "Post-deployment verification complete!"
                    '''
                }
            }
        }
    }

    post {
        success {
            slackSend(
                channel: '#deployments',
                color: 'good',
                message: "Deployment to ${params.ENVIRONMENT} succeeded! Image: ${params.IMAGE_TAG}"
            )
        }
        failure {
            slackSend(
                channel: '#deployments',
                color: 'danger',
                message: "Deployment to ${params.ENVIRONMENT} FAILED! Image: ${params.IMAGE_TAG}"
            )

            // Auto-rollback on failure
            container('kubectl') {
                sh '''
                    NAMESPACE="unified-health-${ENVIRONMENT}"
                    kubectl rollout undo deployment/unified-health-api -n $NAMESPACE || true
                '''
            }
        }
        always {
            cleanWs()
        }
    }
}

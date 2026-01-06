# Deprecated Workflows

These workflow files have been consolidated into a single **unified-pipeline.yml** file.

## Merged On
2026-01-06

## Reason for Deprecation
These individual workflows have been merged into a unified pipeline to:
- Reduce maintenance overhead
- Improve pipeline visibility and debugging
- Ensure consistent execution order
- Provide better environment separation
- Enable smarter job dependencies

## Files Deprecated

| Original Workflow | Merged Into |
|-------------------|-------------|
| ci-tests.yml | unified-pipeline.yml (unit-tests, security-tests, code-quality jobs) |
| security-check.yml | unified-pipeline.yml (sast, secret-scan, codeql, iac-scan, dependency-audit jobs) |
| web-frontend-deploy.yml | unified-pipeline.yml (build-images, deploy-* jobs) |
| aws-provider-check.yml | unified-pipeline.yml (aws-provider-check job) |
| lighthouse-ci.yml | unified-pipeline.yml (lighthouse job) |
| sbom-generation.yml | unified-pipeline.yml (sbom job) |
| terraform-aws.yml | unified-pipeline.yml (terraform-validate, terraform-plan, terraform-apply jobs) |
| terraform-dev-prod-gated.yml | unified-pipeline.yml (terraform-* and deploy-* jobs with environment gates) |
| scheduled-production-deploy.yml | unified-pipeline.yml (scheduled trigger + deploy-production job) |
| terraform-drift-check.yml | unified-pipeline.yml (drift-check job) |
| test-actions.yml | unified-pipeline.yml (setup job validates workflow syntax) |

## Rollback Instructions
If you need to restore the old workflows:

```bash
# Move files back
cd .github
mv workflows-deprecated/*.yml workflows/
```

**Note**: You should also remove `unified-pipeline.yml` to avoid conflicts.

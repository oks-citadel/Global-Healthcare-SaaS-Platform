#!/usr/bin/env ts-node
/**
 * Security Agent - Code Scanner
 *
 * Scans the codebase for common security vulnerabilities and generates
 * actionable reports with fix suggestions.
 *
 * Usage:
 *   npx ts-node tools/security-agent/scan.ts
 *   pnpm security:scan
 */

import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

// Vulnerability patterns to detect
interface VulnerabilityPattern {
  id: string;
  name: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  pattern: RegExp;
  filePattern: string;
  fix: string;
  cwe?: string;
}

interface Finding {
  id: string;
  name: string;
  severity: string;
  file: string;
  line: number;
  code: string;
  description: string;
  fix: string;
  cwe?: string;
}

// Security vulnerability patterns
const VULNERABILITY_PATTERNS: VulnerabilityPattern[] = [
  // Mass Assignment
  {
    id: "SEC001",
    name: "Potential Mass Assignment",
    description:
      "Passing req.body directly to update/create without DTO validation",
    severity: "CRITICAL",
    pattern: /\.(update|create|upsert)\s*\(\s*\{[^}]*data:\s*req\.body/g,
    filePattern: "**/*.ts",
    fix: "Use a validated DTO schema (Zod) to whitelist allowed fields before passing to ORM",
    cwe: "CWE-915",
  },
  {
    id: "SEC002",
    name: "Unsafe Spread Operator",
    description:
      "Spreading req.body directly into object may include malicious fields",
    severity: "HIGH",
    pattern: /\{\s*\.\.\.req\.body[^}]*\}/g,
    filePattern: "**/*.ts",
    fix: "Destructure only the fields you need or use DTO validation",
    cwe: "CWE-915",
  },
  // Role in Registration
  {
    id: "SEC003",
    name: "Role Field in User Input Schema",
    description:
      "User registration schema allows role field, enabling privilege escalation",
    severity: "CRITICAL",
    pattern: /z\.object\s*\(\s*\{[^}]*role:\s*z\./g,
    filePattern: "**/auth*.ts",
    fix: "Remove role from registration schema. Set role server-side.",
    cwe: "CWE-269",
  },
  // Missing Authorization
  {
    id: "SEC004",
    name: "Missing Authorization Check",
    description: "Route handler may lack authorization after authentication",
    severity: "HIGH",
    pattern:
      /router\.(get|post|put|patch|delete)\s*\([^)]+authenticate\s*\)[^,]*\)/g,
    filePattern: "**/routes/*.ts",
    fix: "Add authorize() middleware after authenticate() for protected routes",
    cwe: "CWE-862",
  },
  // Returning ORM entities directly
  {
    id: "SEC005",
    name: "ORM Entity Exposure",
    description:
      "Returning Prisma entities directly may expose internal fields",
    severity: "MEDIUM",
    pattern: /res\.(json|send)\s*\(\s*(await\s+)?prisma\./g,
    filePattern: "**/*.ts",
    fix: "Map ORM entities to response DTOs before returning",
    cwe: "CWE-200",
  },
  // Non-strict Zod schemas
  {
    id: "SEC006",
    name: "Non-Strict DTO Schema",
    description: "Zod schema without .strict() accepts unknown fields",
    severity: "MEDIUM",
    pattern: /z\.object\s*\(\s*\{[^}]+\}\s*\)(?!\.strict\(\))/g,
    filePattern: "**/dtos/*.ts",
    fix: "Add .strict() to Zod schemas to reject unknown fields",
    cwe: "CWE-20",
  },
  // Hardcoded secrets
  {
    id: "SEC007",
    name: "Hardcoded Secret",
    description: "Potential hardcoded secret or API key detected",
    severity: "CRITICAL",
    pattern:
      /(api[_-]?key|secret|password|token)\s*[:=]\s*['"][^'"]{10,}['"]/gi,
    filePattern: "**/*.ts",
    fix: "Move secrets to environment variables",
    cwe: "CWE-798",
  },
  // SQL/NoSQL Injection
  {
    id: "SEC008",
    name: "Potential SQL/NoSQL Injection",
    description: "String concatenation in query may allow injection",
    severity: "CRITICAL",
    pattern: /\$\{.*req\.(body|query|params).*\}/g,
    filePattern: "**/*.ts",
    fix: "Use parameterized queries or ORM methods",
    cwe: "CWE-89",
  },
  // Missing Input Validation
  {
    id: "SEC009",
    name: "Missing Input Validation",
    description: "Request parameter used without validation",
    severity: "MEDIUM",
    pattern: /req\.params\.[a-zA-Z]+(?!\s*;|\s*\)|[^;]*validate|[^;]*parse)/g,
    filePattern: "**/controllers/*.ts",
    fix: "Validate req.params using Zod or similar validation library",
    cwe: "CWE-20",
  },
  // Debug Endpoints
  {
    id: "SEC010",
    name: "Debug Endpoint",
    description: "Debug or test endpoint should not be in production",
    severity: "HIGH",
    pattern: /router\.(get|post)\s*\(\s*['"]\/debug|['"]\/test|['"]\/internal/g,
    filePattern: "**/routes/*.ts",
    fix: "Remove debug endpoints or add environment check",
    cwe: "CWE-489",
  },
  // Bypass Flags
  {
    id: "SEC011",
    name: "Security Bypass Flag",
    description: "Bypass flag may allow security controls to be disabled",
    severity: "HIGH",
    pattern: /(skip|bypass|disable|ignore)(Auth|Validation|Check|Security)/gi,
    filePattern: "**/*.ts",
    fix: "Remove bypass flags or add proper audit logging",
    cwe: "CWE-284",
  },
  // Console.log in production
  {
    id: "SEC012",
    name: "Console.log in Code",
    description: "Console.log may leak sensitive data in production",
    severity: "LOW",
    pattern: /console\.(log|debug|info|warn|error)\s*\(/g,
    filePattern: "**/src/**/*.ts",
    fix: "Use structured logger (Winston) instead of console.log",
    cwe: "CWE-532",
  },
  // Missing Rate Limiting
  {
    id: "SEC013",
    name: "Potential Missing Rate Limit",
    description: "Auth endpoint without explicit rate limiting",
    severity: "MEDIUM",
    pattern: /router\.post\s*\(\s*['"]\/auth\/(login|register|reset)/g,
    filePattern: "**/routes/*.ts",
    fix: "Apply rate limiting middleware to auth endpoints",
    cwe: "CWE-307",
  },
  // State Transition Without Validation
  {
    id: "SEC014",
    name: "Unvalidated State Transition",
    description: "Status/state change without validating current state",
    severity: "HIGH",
    pattern: /status:\s*(req\.body\.status|input\.status|data\.status)/g,
    filePattern: "**/*.ts",
    fix: "Validate state transitions using state machine",
    cwe: "CWE-840",
  },
  // Weak JWT Configuration
  {
    id: "SEC015",
    name: "Weak JWT Configuration",
    description: "JWT using weak algorithm or short expiry override",
    severity: "HIGH",
    pattern: /algorithm:\s*['"]HS256['"]\s*,\s*expiresIn:\s*['"][0-9]+d['"]/g,
    filePattern: "**/*.ts",
    fix: "Use RS256 for production or ensure short expiry for HS256",
    cwe: "CWE-327",
  },
];

// Excluded patterns (false positives)
const EXCLUSIONS = [
  /node_modules/,
  /dist\//,
  /\.test\.ts$/,
  /\.spec\.ts$/,
  /tests\//,
  /\.d\.ts$/,
];

async function scanFile(filePath: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  // Check exclusions
  if (EXCLUSIONS.some((exc) => exc.test(filePath))) {
    return findings;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  for (const pattern of VULNERABILITY_PATTERNS) {
    // Check if file matches pattern
    const minimatch = await import("minimatch");
    if (!minimatch.default(filePath, pattern.filePattern)) {
      continue;
    }

    // Find all matches
    let match;
    while ((match = pattern.pattern.exec(content)) !== null) {
      // Find line number
      const beforeMatch = content.substring(0, match.index);
      const lineNumber = beforeMatch.split("\n").length;
      const codeLine = lines[lineNumber - 1]?.trim() || "";

      findings.push({
        id: pattern.id,
        name: pattern.name,
        severity: pattern.severity,
        file: filePath,
        line: lineNumber,
        code: codeLine.substring(0, 100) + (codeLine.length > 100 ? "..." : ""),
        description: pattern.description,
        fix: pattern.fix,
        cwe: pattern.cwe,
      });
    }

    // Reset regex lastIndex
    pattern.pattern.lastIndex = 0;
  }

  return findings;
}

async function scan(rootPath: string): Promise<Finding[]> {
  console.log("🔍 Security Agent - Scanning codebase...\n");

  const allFindings: Finding[] = [];

  // Find all TypeScript files
  const files = await glob("**/*.ts", {
    cwd: rootPath,
    ignore: ["node_modules/**", "dist/**", "*.d.ts"],
    absolute: true,
  });

  console.log(`📂 Scanning ${files.length} files...\n`);

  for (const file of files) {
    const findings = await scanFile(file);
    allFindings.push(...findings);
  }

  return allFindings;
}

function generateReport(findings: Finding[]): string {
  const criticalCount = findings.filter(
    (f) => f.severity === "CRITICAL",
  ).length;
  const highCount = findings.filter((f) => f.severity === "HIGH").length;
  const mediumCount = findings.filter((f) => f.severity === "MEDIUM").length;
  const lowCount = findings.filter((f) => f.severity === "LOW").length;

  let report = `# Security Scan Report

**Generated:** ${new Date().toISOString()}
**Scanner:** UnifiedHealth Security Agent v1.0

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | ${criticalCount} |
| HIGH | ${highCount} |
| MEDIUM | ${mediumCount} |
| LOW | ${lowCount} |
| **TOTAL** | **${findings.length}** |

## Status

`;

  if (criticalCount > 0 || highCount > 0) {
    report += `**FAILED** - Critical or high severity issues found\n\n`;
  } else if (mediumCount > 0) {
    report += `**WARNING** - Medium severity issues found\n\n`;
  } else if (lowCount > 0) {
    report += `**PASSED** - Only low severity issues found\n\n`;
  } else {
    report += `**PASSED** - No security issues found\n\n`;
  }

  report += `---

## Findings

`;

  // Group by severity
  const groupedFindings: Record<string, Finding[]> = {
    CRITICAL: [],
    HIGH: [],
    MEDIUM: [],
    LOW: [],
  };

  for (const finding of findings) {
    groupedFindings[finding.severity].push(finding);
  }

  for (const severity of ["CRITICAL", "HIGH", "MEDIUM", "LOW"]) {
    const severityFindings = groupedFindings[severity];
    if (severityFindings.length === 0) continue;

    report += `### ${severity} (${severityFindings.length})\n\n`;

    for (const finding of severityFindings) {
      const relativePath = finding.file.replace(process.cwd(), "");
      report += `#### ${finding.id}: ${finding.name}

- **File:** \`${relativePath}:${finding.line}\`
- **Description:** ${finding.description}
${finding.cwe ? `- **CWE:** ${finding.cwe}` : ""}
- **Code:**
  \`\`\`typescript
  ${finding.code}
  \`\`\`
- **Fix:** ${finding.fix}

`;
    }
  }

  report += `---

## Remediation Priority

1. Fix all CRITICAL issues before merge
2. Fix HIGH issues within 24 hours
3. Address MEDIUM issues within 1 week
4. LOW issues can be addressed in regular maintenance

## Next Steps

1. Review each finding
2. Apply the suggested fix
3. Add test cases for the vulnerability
4. Re-run the security scan

---

_Report generated by UnifiedHealth Security Agent_
`;

  return report;
}

async function main() {
  const rootPath = process.cwd();
  const outputDir = path.join(rootPath, "SECURITY");

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Run scan
  const findings = await scan(rootPath);

  // Generate report
  const report = generateReport(findings);

  // Write report
  const reportPath = path.join(outputDir, "security-report.md");
  fs.writeFileSync(reportPath, report);
  console.log(`📄 Report written to: ${reportPath}\n`);

  // Print summary
  const criticalCount = findings.filter(
    (f) => f.severity === "CRITICAL",
  ).length;
  const highCount = findings.filter((f) => f.severity === "HIGH").length;

  console.log("═══════════════════════════════════════");
  console.log("           SECURITY SCAN RESULTS       ");
  console.log("═══════════════════════════════════════\n");

  console.log(`CRITICAL: ${criticalCount}`);
  console.log(`HIGH:     ${highCount}`);
  console.log(
    `MEDIUM:   ${findings.filter((f) => f.severity === "MEDIUM").length}`,
  );
  console.log(
    `LOW:      ${findings.filter((f) => f.severity === "LOW").length}`,
  );
  console.log(`TOTAL:    ${findings.length}\n`);

  if (criticalCount > 0 || highCount > 0) {
    console.log("❌ SCAN FAILED - Critical/High issues found\n");
    console.log("Please fix the issues listed in SECURITY/security-report.md");
    process.exit(1);
  } else {
    console.log("✅ SCAN PASSED\n");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Security scan failed:", err);
  process.exit(1);
});

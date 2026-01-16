# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the Unified Health Global Platform.

## What is an ADR?

An Architecture Decision Record is a document that captures an important architectural decision made along with its context and consequences.

## ADR Template

Each ADR follows this structure:

- **Title**: A descriptive title for the decision
- **Status**: Proposed, Accepted, Deprecated, or Superseded
- **Context**: The situation that called for this decision
- **Decision**: The change we're proposing or have agreed to implement
- **Consequences**: What becomes easier or more difficult as a result

## Index of ADRs

| ID | Title | Status | Date |
|----|-------|--------|------|
| [ADR-001](./ADR-001-microservices-architecture.md) | Microservices Architecture | Accepted | 2025-12 |
| [ADR-002](./ADR-002-authentication-strategy.md) | Authentication Strategy (JWT) | Accepted | 2025-12 |
| [ADR-003](./ADR-003-database-per-service.md) | Database per Service Pattern | Accepted | 2025-12 |

## Creating a New ADR

1. Copy the template below
2. Name the file `ADR-XXX-short-title.md` where XXX is the next sequential number
3. Fill in the sections
4. Submit for review via pull request
5. Update this README with the new ADR

## ADR Template

```markdown
# ADR-XXX: Title

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-XXX

## Date
YYYY-MM-DD

## Context
What is the issue that we're seeing that motivates this decision or change?

## Decision
What is the change that we're proposing and/or doing?

## Consequences
What becomes easier or more difficult to do because of this change?

### Positive
- Benefit 1
- Benefit 2

### Negative
- Drawback 1
- Drawback 2

### Neutral
- Side effect 1

## References
- Link to relevant documentation
- Link to related ADRs
```

---

**Last Updated:** 2025-12

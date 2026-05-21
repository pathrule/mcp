# Security Policy

## Reporting A Vulnerability

Please report suspected vulnerabilities privately by emailing:

```text
security@pathrule.io
```

Include the affected endpoint, a short reproduction path, expected impact, and any relevant request IDs or timestamps. Do not include Pathrule workspace content unless it is necessary to explain the issue.

## Secret Handling

The public repository must not contain production secret values, private keys, bearer tokens, refresh tokens, or database admin keys.

Remote MCP requires production secrets at deploy time through the hosting provider's secret manager:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_JWT_SECRET
PATHRULE_CONNECTOR_TOKEN_ENCRYPTION_KEY
PATHRULE_CONNECTOR_TOKEN_ENCRYPTION_KEY_VERSION
PATHRULE_CONNECTOR_TOKEN_ENCRYPTION_PREVIOUS_KEYS
PATHRULE_WEB_ORIGIN
```

`SUPABASE_JWT_SECRET` is sensitive production infrastructure material. Rotate it if exposure is suspected.

## Access Boundaries

- Remote MCP authorizes requests through OAuth connector sessions.
- Workspace reads and writes execute as the authenticated user through Supabase RLS.
- Remote MCP does not read local files, install local hooks, or write local companion files.
- MCP telemetry is metadata-only and must not include memory/rule/skill bodies or tool input content.

## Release Checks

Before publishing an update to `pathrule/mcp`, run:

```bash
pnpm --filter @pathrule/cloud-connector build
pnpm run release:stage-remote-mcp-repo
pnpm run cloud-connector:release-gates
```

The staging command builds a public repo payload and fails if common secret markers are found.

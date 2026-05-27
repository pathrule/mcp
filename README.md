# Pathrule Remote MCP

Pathrule Remote MCP exposes Pathrule workspace memory, rules, skills, setup, snapshots, and activity logging over the Model Context Protocol.

Public endpoint:

```text
https://mcp.pathrule.io/mcp
```

Registry manifest:

```text
https://mcp.pathrule.io/server.json
```

## What It Does

Pathrule gives AI coding agents path-scoped project context. The remote MCP server lets cloud MCP clients use the same Pathrule workspace data without installing Pathrule Desktop or the local CLI on the client host.

Remote MCP is intentionally cloud-only. It can read and write Pathrule cloud records, but it cannot read local files, install hooks, render `AGENTS.md` / `CLAUDE.md`, or materialize local skills. For those local runtime features, use Pathrule Desktop or `@pathrule/cli`.

## Using Pathrule Remote MCP

Pathrule Remote MCP is the MCP endpoint for Pathrule Web workspaces. It is not a general-purpose hosted memory service that works without Pathrule.

To use it:

1. Create or sign in to a Pathrule account:

```text
https://app.pathrule.io
```

2. Create or select a Pathrule workspace in the app.

3. Connect your MCP client to:

```text
https://mcp.pathrule.io/mcp
```

When an MCP client connects, it starts an OAuth flow through Pathrule Web. After approval, the client can access only the Pathrule workspaces visible to that signed-in account, using the scopes you approved.

This repository is the public source and directory listing target for Pathrule's Remote MCP endpoint. It is not a standalone local memory database, and it does not create a usable Pathrule workspace without a Pathrule account.

## Tools

Workspace and context:

- `pathrule_list_workspaces`
- `pathrule_get_context`
- `pathrule_goto`
- `pathrule_get_tree`
- `pathrule_get_node`
- `pathrule_list_memories`
- `pathrule_read_memory`
- `pathrule_read_rule`
- `pathrule_read_skill`
- `pathrule_ping`

Workspace setup:

- `pathrule_list_organizations`
- `pathrule_create_workspace`
- `pathrule_setup`

Writes:

- `pathrule_write_memory`
- `pathrule_update_memory`
- `pathrule_delete_memory`
- `pathrule_write_rule`
- `pathrule_update_rule`
- `pathrule_delete_rule`
- `pathrule_write_skill`
- `pathrule_update_skill`
- `pathrule_delete_skill`

Snapshots, refreshes, and activity:

- `pathrule_take_snapshot`
- `pathrule_list_snapshots`
- `pathrule_read_snapshot`
- `pathrule_list_pending_refreshes`
- `pathrule_get_refresh_brief`
- `pathrule_resolve_refresh`
- `pathrule_log_activity`
- `pathrule_get_local_runtime_upgrade`

## Security Model

- OAuth scopes decide the tool surface. Read tools require `pathrule:read`; write tools require `pathrule:write`; refresh/activity tools require `pathrule:activity`.
- Every workspace operation runs through the authenticated user's Supabase JWT and database RLS policies.
- The connector does not use Supabase admin keys to widen user access.
- Write tools are also gated by workspace subscription status and per-user/per-workspace rate limits.
- MCP event telemetry is metadata-only: tool name, user/workspace/client identifiers, status/error code, and latency bucket. Tool input and content bodies are not logged.
- The remote server never accesses the user's filesystem and never writes local companion files.

## Operator Notes

The `mcp.pathrule.io` service is operated by Pathrule. The environment variables below are for Pathrule operators deploying the service against Pathrule's backend. They are not required to connect an MCP client to Pathrule Remote MCP.

Required production secrets are environment variables only. Do not commit values for:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_JWT_SECRET
PATHRULE_CONNECTOR_TOKEN_ENCRYPTION_KEY
PATHRULE_CONNECTOR_TOKEN_ENCRYPTION_KEY_VERSION
PATHRULE_CONNECTOR_TOKEN_ENCRYPTION_PREVIOUS_KEYS
PATHRULE_WEB_ORIGIN
```

`SUPABASE_JWT_SECRET` is used to sign short-lived authenticated-role user JWTs for Supabase RLS. Treat it like production infrastructure secret material and store it only in the hosting provider's secret manager.

## Running The Server

The public `pathrule/mcp` repository is staged from the Pathrule monorepo and contains a bundled Node.js server for transparency and deployment reproducibility. Running it yourself requires the environment variables above and Pathrule's compatible backend; it is not the recommended user setup path.

```bash
npm install
npm start
```

The server listens on `PORT` and `HOST`:

```text
PORT=8787
HOST=0.0.0.0
```

Health and metadata:

```bash
curl -fsS http://localhost:8787/healthz
curl -fsS http://localhost:8787/server.json
```

## Registry Inspection

The public repository includes a `Dockerfile` for MCP registry scanners such as Glama. The container sets `PATHRULE_MCP_PUBLIC_INTROSPECTION=1`, which exposes MCP schema introspection without a bearer token so registries can verify the server shape.

That mode does not grant Pathrule data access. Tool calls still require an authenticated Pathrule context and return auth errors without OAuth.

## MCP Directory Submission

Use these fields for MCP directories:

```text
GitHub Repository URL: https://github.com/pathrule/mcp
npm Package: leave blank unless @pathrule/mcp is published
Short Description: Path-scoped team memories, rules and skills for AI coding agents.
Server URL: https://mcp.pathrule.io/mcp
```

## License

MIT

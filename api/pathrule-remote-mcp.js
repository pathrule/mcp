import { createCloudConnectorHttpRouter } from "../dist/index.js";

const router = createCloudConnectorHttpRouter();

function restoreOriginalPath(req) {
  const current = new URL(req.url ?? "/", "https://mcp.pathrule.io");
  const rewrittenPath = current.searchParams.get("path");
  if (rewrittenPath === null) return;

  current.searchParams.delete("path");
  current.pathname = `/${rewrittenPath}`.replace(/\/{2,}/g, "/");
  req.url = `${current.pathname}${current.search}`;
}

export default async function handler(req, res) {
  restoreOriginalPath(req);
  await router(req, res);
}

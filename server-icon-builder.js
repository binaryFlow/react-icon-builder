#!/usr/bin/env node
const http = require("http");
const fs   = require("fs");
const path = require("path");
const os   = require("os");

const PORT      = 7891;
const ICONS_DIR = path.join(os.homedir(), "projects/frontend-v6/src/components/icons");

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  if (req.method === "POST" && req.url === "/save") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { iconName, componentName, code } = JSON.parse(body);

        if (!iconName || !componentName || !code)
          throw new Error("Missing required fields");

        if (!fs.existsSync(ICONS_DIR))
          throw new Error(`Icons directory not found:\n  ${ICONS_DIR}`);

        // Write <icon-name>.tsx
        const tsxPath = path.join(ICONS_DIR, `${iconName}.tsx`);
        fs.writeFileSync(tsxPath, code, "utf8");

        // Append to index.ts if the export line isn't already there
        const indexPath  = path.join(ICONS_DIR, "index.ts");
        const exportLine = `export { ${componentName} } from './${iconName}';`;
        let existing = "";
        try { existing = fs.readFileSync(indexPath, "utf8"); } catch {}

        if (!existing.includes(exportLine)) {
          const sep = existing.length > 0 && !existing.endsWith("\n") ? "\n" : "";
          fs.writeFileSync(indexPath, existing + sep + exportLine + "\n", "utf8");
        }

        console.log(`✓  ${iconName}.tsx  →  index.ts updated`);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        console.error(`✗  ${e.message}`);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  if (req.method === "GET" && req.url === "/ping") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, dir: ICONS_DIR }));
    return;
  }

  res.writeHead(404); res.end();
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`\nIcon Builder server  →  http://127.0.0.1:${PORT}`);
  console.log(`Icons directory      →  ${ICONS_DIR}\n`);
});

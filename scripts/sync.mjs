#!/usr/bin/env node
// Writes every agent's manifest from plugin.config.json, so the name, version,
// descriptions and links can never drift apart between them.
//
//   node scripts/sync.mjs          write the manifests
//   node scripts/sync.mjs --check  fail if a manifest on disk is out of date
//
// Edit plugin.config.json (or skills/), never a generated manifest.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cfg = JSON.parse(readFileSync(resolve(root, "plugin.config.json"), "utf8"));
const check = process.argv.includes("--check");

const repoUrl = `https://github.com/${cfg.repo}`;
const { name, displayName, version, license, homepage, author, keywords } = cfg;

// What each host calls a hosted (streamable HTTP) MCP server.
const httpServer = { type: "http", url: cfg.mcpUrl };

// The listing details OpenAI's hosts (Codex, ChatGPT) show for a plugin.
const openaiInterface = {
  displayName,
  shortDescription: cfg.shortDescription,
  longDescription: cfg.longDescription,
  developerName: author.name,
  category: cfg.categories.codex,
  capabilities: ["Interactive", "Read", "Write"],
  websiteURL: homepage,
  supportURL: cfg.links.support,
  privacyPolicyURL: cfg.links.privacy,
  termsOfServiceURL: cfg.links.terms,
  defaultPrompt: cfg.prompts,
  brandColor: cfg.brandColor,
  brandColorDark: cfg.brandColorDark,
  composerIcon: "./assets/logo.png",
  logo: "./assets/logo.png",
};

const files = {
  // Open Agent Plugins format (agent-plugins.org): the shared entry point.
  // Skills are found in skills/, the MCP server in mcp.json, both by convention.
  "plugin.json": {
    $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
    name,
    version,
    description: cfg.description,
    author,
    homepage,
    repository: repoUrl,
    license,
    keywords,
    extensions: { "com.openai": { interface: openaiInterface } },
  },
  "mcp.json": {
    $schema: "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
    mcpServers: { [name]: { type: "streamable-http", url: cfg.mcpUrl } },
  },

  // Claude Code.
  ".claude-plugin/plugin.json": {
    name,
    displayName,
    version,
    description: cfg.description,
    author,
    homepage,
    repository: repoUrl,
    license,
    keywords,
    icon: "./assets/logo.png",
    documentationUrl: cfg.links.docs,
    supportUrl: cfg.links.support,
    privacyPolicyUrl: cfg.links.privacy,
    termsOfServiceUrl: cfg.links.terms,
    skills: "./skills/",
    mcpServers: "./agents/claude/.mcp.json",
  },
  "agents/claude/.mcp.json": { mcpServers: { [name]: httpServer } },
  // A marketplace with this one plugin, so the repo can be added directly.
  // Copilot CLI and the ChatGPT desktop app read this file too.
  ".claude-plugin/marketplace.json": {
    $schema: "https://anthropic.com/claude-code/marketplace.schema.json",
    name,
    owner: { name: author.name, email: author.email },
    metadata: { description: cfg.tagline },
    plugins: [
      {
        name,
        source: "./",
        description: cfg.description,
        category: cfg.categories.claude,
        homepage,
      },
    ],
  },

  // Codex (and ChatGPT), for versions that read the older layout.
  ".codex-plugin/plugin.json": {
    name,
    version,
    description: cfg.description,
    author,
    homepage,
    repository: repoUrl,
    license,
    keywords,
    skills: "./skills/",
    mcpServers: "./agents/codex/.mcp.json",
    interface: openaiInterface,
  },
  "agents/codex/.mcp.json": { mcpServers: { [name]: httpServer } },

  // Cursor.
  ".cursor-plugin/plugin.json": {
    name,
    displayName,
    version,
    description: cfg.tagline,
    // Cursor's schema allows only a name and an email here.
    author: { name: author.name, email: author.email },
    homepage,
    repository: repoUrl,
    license,
    logo: "assets/logo.png",
    keywords,
    category: cfg.categories.cursor,
    tags: ["print", "business-cards", "design", "mcp"],
    skills: "./skills/",
    mcpServers: "./agents/cursor/mcp.json",
  },
  "agents/cursor/mcp.json": { mcpServers: { [name]: httpServer } },

  // Antigravity. It reads its MCP servers from mcp_config.json at the root.
  ".antigravity-plugin/plugin.json": {
    $schema: "https://antigravity.google/schemas/v1/plugin.json",
    name,
    displayName,
    version,
    description: cfg.description,
    logo: "assets/logo.png",
    suggestedPrompts: cfg.prompts,
    keywords,
    author,
    homepage,
    repository: repoUrl,
    license,
  },
  "mcp_config.json": { mcpServers: { [name]: { serverUrl: cfg.mcpUrl } } },

  // Gemini CLI.
  "gemini-extension.json": {
    name,
    version,
    description: cfg.description,
    contextFileName: "DESIGNPRINT.md",
    mcpServers: { [name]: httpServer },
  },

  // The official MCP Registry listing for the hosted server.
  "server.json": {
    $schema: "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
    name: cfg.registry.name,
    title: displayName,
    description: cfg.registry.description,
    version: cfg.registry.version,
    websiteUrl: homepage,
    icons: [{ src: cfg.links.icon, mimeType: "image/png", sizes: ["512x512"] }],
    remotes: [{ type: "streamable-http", url: cfg.mcpUrl }],
  },
};

// Limits the hosts enforce. Checked here so a bad edit fails before it ships.
const problems = [];
const limit = (label, text, max) => {
  if (text.length > max) problems.push(`${label} is ${text.length} characters; the limit is ${max}.`);
};
limit("registry.description", cfg.registry.description, 100);
limit("shortDescription", cfg.shortDescription, 64);
limit("description", cfg.description, 4000);
if (cfg.prompts.length > 3) problems.push("prompts: at most 3 are allowed.");
if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(name)) problems.push("name must be lowercase letters, digits and hyphens.");

const skillPath = resolve(root, "skills", name, "SKILL.md");
if (!existsSync(skillPath)) {
  problems.push(`skills/${name}/SKILL.md is missing.`);
} else {
  const front = /^---\n([\s\S]*?)\n---\n/.exec(readFileSync(skillPath, "utf8"));
  const field = (key) => {
    const line = front ? front[1].split("\n").find((l) => l.startsWith(`${key}:`)) : undefined;
    if (!line) return "";
    const raw = line.slice(key.length + 1).trim();
    return raw.startsWith('"') ? JSON.parse(raw) : raw;
  };
  if (field("name") !== name) problems.push("SKILL.md: name must match its folder name.");
  const description = field("description");
  if (!description) problems.push("SKILL.md: description is missing.");
  limit("SKILL.md description", description, 1024);
  if (/[<>]/.test(description)) problems.push("SKILL.md description must not contain < or >.");
}

let stale = 0;
for (const [path, value] of Object.entries(files)) {
  const target = resolve(root, path);
  const next = JSON.stringify(value, null, 2) + "\n";
  const current = existsSync(target) ? readFileSync(target, "utf8") : null;
  if (current === next) continue;
  if (check) {
    stale += 1;
    console.error(`out of date: ${path}`);
  } else {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, next);
    console.log(`wrote ${path}`);
  }
}

for (const problem of problems) console.error(`problem: ${problem}`);
if (stale) console.error("Run `node scripts/sync.mjs` and commit the result.");
if (problems.length || stale) process.exit(1);
console.log(check ? "All manifests are up to date." : "Done.");

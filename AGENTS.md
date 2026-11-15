# AGENTS.md

This repository distributes Designprint to AI agents. It holds one skill and a set of small manifest files, one per agent, that all point at the hosted MCP server at `https://thedesignprint.com/mcp`. The server itself lives elsewhere; nothing here runs.

## How it is put together

- `plugin.config.json` is the single source for the name, version, descriptions and links.
- `node scripts/sync.mjs` writes every manifest from it. Never edit a generated manifest by hand.
- `skills/designprint/SKILL.md` is the instruction file agents load. It is written by hand.

Generated files:

| File | Read by |
| --- | --- |
| `plugin.json`, `mcp.json` | The open Agent Plugins format: GitHub Copilot CLI, Codex and other hosts that support it |
| `.claude-plugin/plugin.json`, `agents/claude/.mcp.json` | Claude Code |
| `.claude-plugin/marketplace.json` | Claude Code, Codex and Copilot CLI, as a one-plugin marketplace |
| `.codex-plugin/plugin.json`, `agents/codex/.mcp.json` | Codex versions that read the older layout |
| `.cursor-plugin/plugin.json`, `agents/cursor/mcp.json` | Cursor |
| `.antigravity-plugin/plugin.json`, `mcp_config.json` | Antigravity |
| `gemini-extension.json`, `DESIGNPRINT.md` | Gemini CLI |
| `server.json` | The official MCP Registry listing |

## Rules

- Keep the skill true to the live service. The tool list on the server is the source of truth: `tools/list` on `https://thedesignprint.com/mcp`. Do not describe a tool or an input that the live server does not have.
- Do not put prices in any file. Prices come from the tool results.
- Do not state how many tools or card designs there are, and do not list the design names. Both change on the server; point at the live list.
- Keep every path inside this folder. Hosts copy the plugin into their own cache, so a path outside it breaks.
- Do not move `skills/`, `agents/`, `assets/` or any manifest.

## Releasing a change

1. Edit `plugin.config.json` or the skill. Raise `version` for any change a user should receive.
2. Run `node scripts/sync.mjs`.
3. Run `node scripts/sync.mjs --check` and `claude plugin validate . --strict`.
4. Commit, tag `v<version>` and push the tag.

Raise `registry.version` only when the registry listing itself changes (its name, description, icon or address), then publish `server.json` with `mcp-publisher publish`.

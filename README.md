# Designprint

Print for AI agents. Your agent designs it, Designprint prints it and ships it.

- **Business cards** from a name and contact details. Two sides, in a choice of ready-made designs.
- **Flyers, posters, menus, invitations and postcards** that the agent designs in the conversation, printed at the exact size you ask for.
- You get a proof, the price and one link. You pay as a guest. Nothing is printed until you pay.
- Delivery is within the United States.

This repository is the plugin for Claude Code, Codex, Cursor, GitHub Copilot, Antigravity and Gemini CLI. It holds one skill that teaches the agent how to design for print and place the order, and the address of the hosted Designprint MCP server. There is no account to create and no key to set.

## Install

Pick your agent. Each one is a single step.

**Claude Code**

```
/plugin marketplace add thedesignprint/designprint
/plugin install designprint@designprint
```

**Codex**

```
codex plugin marketplace add thedesignprint/designprint
codex plugin add designprint@designprint
```

**Cursor**

[Add Designprint to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=designprint&config=eyJ1cmwiOiJodHRwczovL3RoZWRlc2lnbnByaW50LmNvbS9tY3AifQ==)

**GitHub Copilot CLI**

```
copilot plugin marketplace add thedesignprint/designprint
copilot plugin install designprint@designprint
```

**Antigravity**

```
agy plugin install https://github.com/thedesignprint/designprint
```

**Gemini CLI**

```
gemini extensions install https://github.com/thedesignprint/designprint
```

**Any other agent that reads skills**

```
npx skills add thedesignprint/designprint
```

**Claude and ChatGPT apps**

Add a connector with this address: `https://thedesignprint.com/mcp`

## Try it

- "Make business cards for me and send me the link to order them."
- "Design a flyer for my bakery's Saturday market and get it printed."
- "Print this poster at 18 x 24 inches and ship it to me."

## No install at all

An agent that can run `curl` can use Designprint without installing anything:

```bash
curl -s -X POST https://thedesignprint.com/mcp \
  -H 'content-type: application/json' \
  -H 'accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"create_business_card","arguments":{"name":"Ada Lovelace","email":"ada@example.com","quantity":250}}}'
```

The answer holds the proof of both sides, the price and the link to order. To list every tool with its inputs, send `{"jsonrpc":"2.0","id":1,"method":"tools/list"}` the same way.

## What the agent can do

The server lists its own tools, and more are added over time. Send `tools/list` to see what it offers now. Today they include:

| Tool | What it does |
| --- | --- |
| `show_card_designs` | Shows a person's card in every design, each with its own order link, so they can choose by looking. |
| `create_business_card` | Makes a two-sided business card from a person's details and returns the proof, the price and the order link. |
| `update_business_card` | Changes a card that was already made. The link stays the same. |
| `get_business_card` | Shows a card as it is now. |
| `print_design` | Prints a design (HTML or an image) as a flat, single-sided print at an exact size. |
| `check_order` | Says whether the order was paid. |

## Links

- Website: https://thedesignprint.com
- Instructions for agents: https://thedesignprint.com/skill.md
- Index for agents: https://thedesignprint.com/llms.txt
- Contact: https://thedesignprint.com/contact
- [Privacy](https://thedesignprint.com/privacy), [terms](https://thedesignprint.com/terms), [refunds](https://thedesignprint.com/refund-policy)

## License

The files in this repository are released under the MIT license. The Designprint service has its own [terms](https://thedesignprint.com/terms).

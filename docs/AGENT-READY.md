# Agent readiness — isitagentready.com checklist

Scanner: https://isitagentready.com/soukbase.com
Last scan: 2026-10-24 18:24 (UTC+7) — score **40**, level 4 "Agent-Integrated".

| Category | Check | Status 2026-10-24 | When |
|---|---|---|---|
| Discoverability | robots.txt | PASS | — |
| Discoverability | Sitemap | PASS | — |
| Discoverability | Link headers (describedby, alternate, sitemap) | PASS | — |
| Discoverability | DNS-AID (`_index._agents`, SVCB/HTTPS, DNSSEC) | missing | with MCP/API launch |
| Content | Markdown negotiation (`Accept: text/markdown`) | PASS | — |
| Bot access | AI bot rules in robots.txt | PASS | — |
| Bot access | Content Signals | PASS (`search=yes, ai-input=yes, ai-train=no`) | — |
| Bot access | Web Bot Auth (`/.well-known/http-message-signatures-directory`) | missing | later |
| Protocols | API Catalog (`/.well-known/api-catalog`, RFC 9727) | missing | with public API |
| Protocols | OAuth / OIDC discovery | missing | only if seller API needs auth |
| Protocols | OAuth Protected Resource (RFC 9728) | missing | same |
| Protocols | auth.md | missing | same |
| Protocols | MCP Server Card (`/.well-known/mcp/server-card.json`) | missing | with MCP server |
| Protocols | Agent Skills index (`/.well-known/agent-skills/index.json`) | missing | with Capsule |
| Protocols | WebMCP (`document.modelContext.registerTool`) | missing | with catalogue UI |
| Protocols | ARD (`/.well-known/ai-catalog.json`) | missing | with MCP/API |
| Protocols | Personal Agent Protocol (`/.well-known/poppy.json`) | missing | later |
| Commerce | x402 (402 on paid resources, Bazaar listing) | missing | with checkout (Integrator) |
| Commerce | MPP (`/openapi.json` payment discovery) | missing | with checkout |
| Commerce | UCP (`/.well-known/ucp`) | missing | later |
| Commerce | ACP (`/.well-known/acp.json`) | missing | later |

Rule: a check moves to PASS only when the thing behind it really works. No placeholder discovery files.

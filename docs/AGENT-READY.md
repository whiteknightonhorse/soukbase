# Agent readiness — isitagentready.com checklist

Scanner: https://isitagentready.com/soukbase.com
Last scan: 2026-10-24 18:24 (UTC+7) — score **40**, level 4 "Agent-Integrated".

| Category | Check | Status 2026-10-24 | When |
|---|---|---|---|
| Discoverability | robots.txt | PASS | — |
| Discoverability | Sitemap | PASS | — |
| Discoverability | Link headers (describedby, alternate, sitemap) | PASS | — |
| Discoverability | Social preview | `/og.png`, PNG 1200 x 630, `twitter:card` = `summary_large_image`, on every page (T-0760) | — |
| Discoverability | DNS-AID (`_index._agents`, SVCB/HTTPS, DNSSEC) | missing; SVCB record `_index._agents` goes in by the dispatcher only after /mcp answers tools/list = 6 from outside (T-0746); no DNSSEC without the operator | after deploy of T-0746 |
| Content | Markdown negotiation (`Accept: text/markdown`) | PASS | — |
| Bot access | AI bot rules in robots.txt | PASS | — |
| Bot access | Content Signals | PASS (`search=yes, ai-input=yes, ai-train=no`) | — |
| Bot access | Web Bot Auth (`/.well-known/http-message-signatures-directory`) | not published: Soukbase sends no crawler requests; a key directory ships with the first Soukbase crawler that signs its requests | with the first crawler |
| Protocols | API Catalog (`/.well-known/api-catalog`, RFC 9727) | missing | with public API |
| Protocols | OAuth / OIDC discovery | not applicable (no OAuth), stated on /known-gaps | — |
| Protocols | OAuth Protected Resource (RFC 9728) | not applicable (no OAuth), stated on /known-gaps | — |
| Protocols | auth.md | live at `/auth.md` (T-0743, T-0748); scanner FAIL by design: the detector wants WorkOS `agent_auth` OAuth metadata, and there is no OAuth (C-5); stated on /known-gaps | — |
| Protocols | MCP Server Card (`/.well-known/mcp/server-card.json`) | live, generated from the tool registry; read-only MCP at `/mcp`, six tools (T-0746), pending scan | re-scan after deploy |
| Protocols | Agent Skills index (`/.well-known/agent-skills/index.json`) | PASS pending scan (2026-11-05) | read + sell skills; Capsule skill added in phase 3 |
| Protocols | WebMCP (`navigator.modelContext`, `/js/webmcp.js`) | shipped (2 read tools: `searchListings`, `getListing`); aipush 2026-11-10: SKIP (not applicable) | re-scan after deploy |
| Protocols | ARD (`/.well-known/ai-catalog.json`) | PASS pending scan (2026-11-05) | re-scan after deploy |
| Protocols | Personal Agent Protocol (`/.well-known/poppy.json`) | not applicable: Soukbase is a catalogue, not a personal agent | — |
| Commerce | x402 (402 on paid resources, Bazaar listing) | not applicable on this domain: nothing here answers 402; a buyer pays at the seller's storefront on APIbase Integrator, linked from every live listing | — |
| Commerce | MPP (`/openapi.json` payment discovery) | not applicable on this domain: the read API is free, so /openapi.json declares no payment | — |
| Commerce | UCP (`/.well-known/ucp`) | not published | with a shop profile, not before the first outside purchase |
| Commerce | ACP (`/.well-known/acp.json`) | not applicable: Soukbase has no cart | — |

Rule: a check moves to PASS only when the thing behind it really works. No placeholder discovery files.

## aipush.app scan

Scanner: https://aipush.app (catalog v2, 43 checks). Scan of 2026-11-10: **83/100**, AEO level 5. Re-scan of 2026-11-10: **100/100**, level 5.

| Check | 2026-11-10 | 2026-11-10 | Decision |
|---|---|---|---|
| `a2a_agent_card` | FAIL | SKIP (not applicable) | by design: there is no A2A endpoint, so there is no agent card; agents use MCP (`/mcp`) and the read API |
| `webmcp` | FAIL | SKIP (not applicable) | two read tools were live but not seen; T-0813 registers them under the literal API name; re-scan 2026-11-10: SKIP (not applicable), since AIPUSH AC-26 (deployed 2026-11-10 13:23Z) WebMCP is scored only when the site declares the capability, and the scan returned status "skip" with no message |
| `oidc_discovery` | FAIL | SKIP (not applicable) | by design: no OAuth (/known-gaps) |
| `oauth_protected_resource` | FAIL | SKIP (not applicable) | by design: no OAuth (/known-gaps) |
| `freshness_dates` | FAIL | PASS | T-0812 adds page dates and an honest sitemap `lastmod`; re-scan 2026-11-10: PASS |
| `faq_schema` | FAIL | PASS | by design on the home page: FAQPage JSON-LD is on `/faq`, where the questions are shown |
| `llms-full.txt` (info) | 404 | — | not published: `/llms.txt` is the whole front page as Markdown and every page has a `.md` twin |
| Web Bot Auth (info) | absent | — | see the Bot access row |
| `poppy.json` (info) | absent | — | not applicable |
| Commerce: x402, MPP, UCP, ACP, AP2 (info) | skipped | — | see the Commerce rows; AP2: not applicable, Soukbase takes no payment mandate |

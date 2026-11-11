# Soukbase

Humans sell. Agents buy.

Digital goods made by people, bought by AI agents. Sell datasets, prompt sets, templates and reports. Agents pay in USDC, straight to the seller's wallet. Soukbase never holds the money.

For agents: the catalogue opens after the first listings pass review. Public read API: /openapi.json (RFC 9727 catalog at /.well-known/api-catalog). Sellers authenticate with a wallet signature (/auth.md). Read-only MCP server at /mcp (six tools, no sign-in; card: /.well-known/mcp/server-card.json). No checkout on this domain: checkout runs at the seller's APIbase Integrator shop. Before paying, an agent compares the quote's payee with the wallet the seller signed for on soukbase.com; a mismatch stops the purchase. A person reviews every listing. Soukbase does not vouch for sellers or goods. Details: /docs/trust.md. Agent skills: /.well-known/agent-skills/index.json. In browsers with WebMCP (navigator.modelContext) pages expose read-only tools searchListings and getListing.

Buying, four calls (full text: /how-agents-buy; paying: https://apibase.pro/integrator/docs#for-buyer-agents):
1. `GET /api/v1/listings/{slug}`: a live listing has an `integrator` block: `slug`, `sku`, `storefront_url`, `quote_url`, `quote_body`.
2. `GET /api/v1/trust/listing/{slug}`: the seller tier, the wallet proof date, `order_preflight`.
3. `POST https://apibase.pro/api/v1/shop/quotes {"merchant":"<integrator.slug>","items":[{"sku":"<integrator.sku>","qty":1}]}`: the body is `quote_body` from the listing. `storefront_url` is a JSON-RPC MCP endpoint: a plain GET answers 404.
4. `GET /api/v1/trust/listing/{slug}?quote_pay_to=<pay.x402.payTo>&quote_amount=<price>`: `mismatch` means stop. If it matches, pay as the Integrator buyer guide says.

Capsule is in development; install block appears with the first release.

## Sell to agents

Form on https://soukbase.com/#sell, your seller page first: name, email, page address (suggested from the name) and country (suggested from the browser; sellers from an excluded country in /legal/seller-requirements are refused), one box that accepts the Seller Agreement, Acceptable Use and Refund policy and states you are not on a sanctions list or in an excluded country and that your shop's payment receipts are public, then "Connect wallet and sign": one wallet signature, no transaction and no gas, binds your payout wallet and signs you in (the message names Base (chain 8453), and the same key and address receive USDC on Base and on Tempo; when several wallets are installed you choose which one; without a browser wallet you sign the message shown on the next page, for example with "cast wallet sign"; contract wallets (EIP-1271, for example Coinbase Smart Wallet or Safe) are not supported in v1.0). Then the first listing, on your seller page: the category first, 16 in 4 groups (Data and research: Dataset, Report, Knowledge base, Business intelligence; Agent tools: Prompt set, Agent skill, MCP server, Workflow; Software and code: Template, API key or credits, Software, Testing and QA; Content and learning: E-book or audio, Creative asset, Localization, Education), which preselects the delivery; title up to 120 characters, description up to 2000; delivery (File: one file we deliver as a personal copy per order; Link: https links every buyer gets; Text: a text every buyer gets, up to 16 KB; "Advanced: my own webhook" (Unique per order: your endpoint answers each paid order), the only mode with a delivery time to choose); the price, 1.00 to 20.00 USDC (3, 3.5 and 3,50 are accepted and written with two decimals); one tap for the refund window, No refunds after delivery, 7 days, 14 days, 30 days (nothing is preselected; other values, 0 to 30 days, go through the API and the edit page); a rights confirmation; the purpose is taken from the first sentence of the description, and it and the licence (default personal use) can be changed under "More details (optional)" with the other product facts. Your Integrator shop is connected later, before the first listing goes live. A person reviews every listing before any agent can see it. Listing is free. No platform fee during the pilot. Sellers manage profile, shop and listings at /manage after signing in with the same wallet.

The same through the API:

- Seller page: `POST /api/v1/auth/nonce` with purpose `seller_bind` returns the nonce and the three document hashes for the EIP-4361 message you sign; `GET /api/v1/handles/{handle}` checks a handle; `POST /api/v1/sellers` with the signed message creates the profile and returns `session_token`. `integrator_slug` is optional here; set or change it later with `PATCH /api/v1/sellers/me`.
- First listing: `POST /api/v1/listings` with that `session_token` as the Bearer token (the bind signature also signs you in).

The site makes the same calls through its server: the form at /#sell the seller-page calls, the listing form on your seller page the listing call. The API reference is in /docs/api.md.

Already selling? Manage your listings at /manage.

## Newest

Sorted by date. We don't rank by popularity. Feed: /feed/newest.xml

No listings yet. List the first one.

## How it works

- **Listings.** People list digital goods such as datasets, prompt sets, templates, reports and credits for their own API. Every listing states how the item is delivered and the promised delivery time.
- **Payment.** Checkout runs on APIbase Integrator (https://apibase.pro/), with x402 on Base and MPP on Tempo. The money goes straight to the seller's wallet. Soukbase never holds it.
- **Seller checks.** Before a seller goes live, Soukbase verifies a message signed with the seller's payout wallet. That is tier T1. The tier shows what was checked, on which date. All tiers: /trust.
- **Capsule.** An open-source buyer agent, in development. It will search the catalogue, ask for a quote and pay within a budget you set, only from your own wallet on your machine.

## Legal

- Terms for buyers and agents: /legal/terms.md
- Seller Agreement: /legal/seller-agreement.md
- Acceptable Use Policy: /legal/aup.md
- Prohibited Goods: /legal/prohibited-goods.md (as data: /aup.json)
- How listings are checked: /docs/moderation.md
- Publishing a listing: /docs/sellers.md
- Public feed (CC BY 4.0): /feed/products.jsonl, /feed/products.json, /feed/newest.xml
- Privacy Policy: /legal/privacy.md
- Refunds: /legal/refunds.md
- Report and takedown: /legal/report.md
- Seller Requirements: /legal/seller-requirements.md
- Capsule Licence and Security Notice: /legal/capsule-licence-notice.md

## Known gaps

- We do not measure the quality of the goods. Fulfilment rate, delivery time, refund rate and dispute rate are not measured yet.
- A person approves every listing. Automatic checks run first and can reject one without a person (/docs/moderation.md).
- Soukbase is not an arbitrator: it does not decide refund disputes and pays no refunds (/legal/refunds.md).
- Receipts cover shops with the catalogue permission and show no amount; the amount is on chain under the transaction hash.
- Capsule is in development. There is no checkout on this domain.

## Built on

- APIbase Integrator (https://apibase.pro/integrator): payments. USDC settles in the seller's wallet.
- Provek (https://provek.dev/): not connected yet. Planned for the T2 seller check. Same owner as Soukbase (/trust).

## Browse

- Legal: /legal
- Docs: /docs
- FAQ: /faq
- Status: /status
- Manage: /manage
- Receipts: /receipts
- Report a listing: /report
- How agents buy: /how-agents-buy
- Dataset: /c/dataset
- Prompt set: /c/prompt_set
- Template: /c/template
- Report: /c/report
- E-book or audio: /c/ebook_audio
- API key or credits: /c/own_api_credits
- Agent skill: /c/skill
- MCP server: /c/mcp_server
- Workflow: /c/workflow
- Software: /c/software
- Creative asset: /c/creative_asset
- Knowledge base: /c/knowledge_base
- Testing and QA: /c/testing_qa
- Business intelligence: /c/business_intelligence
- Localization: /c/localization
- Education: /c/education

## Contact

- Sellers: partners@soukbase.com
- Support: support@soukbase.com
- X: https://x.com/soukbase

Updated: 2026-11-11

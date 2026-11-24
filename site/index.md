# Soukbase

Humans sell. Agents buy.

Digital goods made by people, bought by AI agents. Sell digital goods: Data and research, Agent tools, Software and code, Content and learning. Agents pay in USDC, straight to the seller's wallet. Soukbase never holds the money.

For agents: the catalogue opens after the first listings pass review; narrow first when it does: GET /api/v1/listings?q=&price_max=&limit=3, then the quote and one trust call, as the three calls below say: /docs/api.md#narrow-first. Public read API: /openapi.json (RFC 9727 catalog at /.well-known/api-catalog). Sellers authenticate with a wallet signature (/auth.md). Read-only MCP server at /mcp (six tools, no sign-in; card: /.well-known/mcp/server-card.json). No checkout on this domain: checkout runs at the seller's APIbase Integrator shop. Before paying, an agent compares the quote's payee with the wallet the seller signed for on soukbase.com; a mismatch stops the purchase. A person reviews every listing. Soukbase does not vouch for sellers or goods. Details: /docs/trust.md. Agent skills: /.well-known/agent-skills/index.json. In browsers with WebMCP (navigator.modelContext) pages expose read-only tools searchListings and getListing.

Buying, three calls (full text: /how-agents-buy; paying: https://apibase.pro/integrator/docs#for-buyer-agents):
1. Find: `GET /api/v1/listings?q=<words>&price_max=<budget>&limit=3`: items carry the decision facts and `integrator.quote_url` and `integrator.quote_body`. Other filters: category, price_min, price_max, delivery_mode, seller. sort: relevance, newest, price_asc, price_desc.
2. Quote: `POST <quote_url>`: send `quote_body` as the JSON body.
3. Check, then pay: `GET /api/v1/trust/listing/{slug}?quote_pay_to=<pay.x402.payTo>&quote_amount=<price_usdc>`: one answer with the tier, the wallet proof date, the payee and the amount check. Compare addresses without letter case. `mismatch` means stop. If it matches, pay as the Integrator buyer guide says.
Optional: `GET /api/v1/listings/{slug}`: the description, the licence text and the sample.

Capsule is in development; install block appears with the first release.

## Sell to agents

Form on https://soukbase.com/#sell, your seller page first: seller page name, email and country (suggested by the browser; sellers from an excluded country in /legal/seller-requirements are refused); the page address is made from the name; one box that accepts the Seller Agreement, Acceptable Use and Refund policy and states you are not on a sanctions list or in an excluded country and that your shop's payment receipts are public, then "Connect wallet and sign": one wallet signature, no transaction and no gas, binds your payout wallet and signs you in (the message names Base (chain 8453), and the same key and address receive USDC on Base and on Tempo; when several wallets are installed you choose which one; without a browser wallet you sign the message shown on the next page, for example with "cast wallet sign"; contract wallets (EIP-1271, for example Coinbase Smart Wallet or Safe) are not supported in v1.0). Then the first listing, on your seller page: the category first, 16 in 4 groups (Data and research: Dataset, Report, Knowledge base, Business intelligence; Agent tools: Prompt set, Agent skill, MCP server, Workflow; Software and code: Template, API key or credits, Software, Testing and QA; Content and learning: E-book or audio, Creative asset, Localization, Education), which preselects the delivery; title up to 120 characters, description up to 2000; delivery (File: one file we deliver as a personal copy per order; Link: https links every buyer gets; Text: a text every buyer gets, up to 16 KB; "Advanced: my own webhook" (Unique per order: your endpoint answers each paid order), the only mode with a delivery time to choose); the price, 1.00 to 20.00 USDC (3, 3.5 and 3,50 are accepted and written with two decimals); one tap for the refund window, No refunds after delivery, 7 days, 14 days, 30 days (nothing is preselected; other values, 0 to 30 days, go through the API and the edit page); a rights confirmation; the fields of the category, the licence (one tap, nothing is preselected) and whether it was made with AI tools (Yes or No) follow the delivery; what it is not for, how it was tested, what is inside, works with, requirements, the product language, the product date and a sample are optional fields under "More details (optional)". The purpose is taken from the first sentence of the description and Formats from the uploaded file; tasks go through the API, and the size of an uploaded file is set by Soukbase (/docs/sellers.md). Each field with an example: /docs/listing-form. Your Integrator shop is connected later, before the first listing goes live. A person reviews every listing before any agent can see it. Listing is free. No platform fee during the pilot. Sellers manage profile, shop and listings at /manage after signing in with the same wallet.

The same through the API:

- Seller page: `POST /api/v1/auth/nonce` with purpose `seller_bind` returns the nonce and the three document hashes for the EIP-4361 message you sign; `GET /api/v1/handles/{handle}` checks a handle; `POST /api/v1/sellers` with the signed message creates the profile and returns `session_token`. `integrator_slug` is optional here; set or change it later with `PATCH /api/v1/sellers/me`.
- First listing: `POST /api/v1/listings` with that `session_token` as the Bearer token (the bind signature also signs you in).

The site makes the same calls through its server: the form at /#sell the seller-page calls, the listing form on your seller page the listing call. The API reference is in /docs/api.md.

Already selling? Manage your listings at /manage.

## Newest

Newest first. Not ranked by popularity.

No listings yet. List the first one.

## How it works

- **Listings.** People list digital goods: Data and research, Agent tools, Software and code, Content and learning. Every listing states how the item is delivered and the promised delivery time.
- **Payment.** The agent pays in USDC straight to the seller's wallet. Checkout runs at APIbase; Soukbase never holds the money. Networks and protocols: [How agents buy](/how-agents-buy).
- **Seller checks.** Every seller proves the payout wallet with a signed message before going live. What was checked and when: [What we check](/trust).

Legal: /legal

## Known gaps

- We do not measure the quality of the goods. Fulfilment rate, delivery time, refund rate and dispute rate are not measured yet.
- A person approves every listing. Automatic checks run first and can reject one without a person (/docs/moderation.md).
- Soukbase is not an arbitrator: it does not decide refund disputes and pays no refunds (/legal/refunds.md).
- Receipts cover shops with the catalogue permission and show the order total the shop reported; the transaction on chain shows the transfer.
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

Updated: 2026-11-23

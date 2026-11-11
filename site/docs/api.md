# Soukbase API

Base URL: https://soukbase.com. Machine description: /openapi.json (catalog at /.well-known/api-catalog). Reading needs no authentication. Sellers sign in with a wallet signature: see /.well-known/auth.md. There are no API keys. Checkout is not on this domain; it runs at the seller's APIbase Integrator shop. Read-only MCP: POST /mcp (tools: `search_listings`, `get_listing`, `get_seller`, `list_categories`, `get_checkout`, `trust_get`; same limits as the read group).

All bodies are JSON. All prices are strings with two decimals in USDC, for example `"12.50"`. Every error has the same shape: `{"error": "...", "code": "...", "field": "...", "next_action": "..."}`. Match on `code`; the wording of `error` can change.

## Routes

<!-- generated:routes -->
| Route | Auth | What it does |
|---|---|---|
| POST /api/v1/auth/nonce | none | Get a single-use nonce for a sign-in message |
| POST /api/v1/auth/siwe | wallet signature in body | Exchange a signed session message for a bearer token |
| GET /api/v1/handles/{handle} | none | Check if a seller handle is free |
| POST /api/v1/sellers | wallet signature in body | Create a seller from a signed wallet message |
| GET /api/v1/sellers/me | session token | Read your own seller record: profile, shop connection, your listings and notices |
| POST /api/v1/sellers/me/notices/read | session token | Mark some of your seller notices read |
| POST /api/v1/sellers/me/handoff | session token | Start the prefilled registration at apibase.pro: your data goes to APIbase from the server, the answer is the link to send the seller to |
| POST /api/v1/sellers/me/telegram/link | session token | Make a one-time link that connects a Telegram chat for your notices |
| DELETE /api/v1/sellers/me/telegram | session token | Unlink Telegram: the stored chat id is deleted |
| POST /api/v1/sellers/me/uploads | session token | Mint an upload link for a hosted_file listing's file, or hand over an instant_text listing's text (the files service holds the bytes) |
| GET /api/v1/sellers/me/uploads/{upload_id} | session token | Read the state of one of your uploads |
| PATCH /api/v1/sellers/me | session token | Change your profile; connect, change or disconnect your Integrator shop (checked against the shop at once; not reserved until verified) |
| GET /api/v1/sellers/{handle} | none | Read a seller's public record |
| POST /api/v1/listings | session token | Create a listing and send it to review |
| PATCH /api/v1/listings/{id} | session token | Change a listing you own |
| GET /api/v1/listings | none | Search live listings |
| GET /api/v1/listings/{id} | none (token adds owner view) | Read one listing (JSON plus schema.org JSON-LD; a live one carries the integrator block: slug, sku, quote_url, quote_body) |
| POST /api/v1/listings/{id}/publish-check | session token | Check again: start the publish check of an approved listing over (once an hour) |
| GET /api/v1/listings/{id}/publish-request | session token | Get the Integrator catalog request for an approved listing |
| GET /api/v1/trust/{sellerHandle} | none | trust_get for a seller (fields in /docs/trust.md) |
| GET /api/v1/trust/listing/{id} | none | trust_get for one live listing, with an optional quote check (fields in /docs/trust.md) |
| GET /api/v1/receipts | none | List public receipts of mirrored paid orders, newest first (no amount) |
| GET /api/v1/receipts/{order_id} | none | Read one public receipt by the Integrator order id (no amount) |
| POST /api/v1/reports | none | Report a listing or an order |
| GET /api/v1/stats | none | Public counts: sellers, listings, paid orders by class (what each means: /docs/status.md) |
| GET /aup.json | none | The prohibited-goods rule list, check ids and its ruleset_hash |
| GET /openapi.json | none | This API as OpenAPI 3.1 |
<!-- /generated:routes -->

`POST /hooks/telegram` is the operator's review webhook and `POST /hooks/telegram-sellers` is the seller bot's (it only links a chat to a seller, see [/docs/sellers.md](/docs/sellers.md)). Each accepts only Telegram's calls with its own secret header and answers 403 to anyone else; neither is part of the API.

`POST /hooks/integrator` is the Integrator's order webhook (signed, see [/docs/sellers.md](/docs/sellers.md)). The public listing feed is `GET /feed/products.jsonl`, `GET /feed/products.json` (live listings only, licence `CC BY 4.0 via soukbase.com`, keep `source_url` and `source_hash`) and `GET /feed/newest.xml` (Atom, the 50 newest). All three answer `ETag`, `If-None-Match` and `If-Modified-Since` with 304.

## Limits

<!-- generated:limits -->
**Rate limits.** Every answer carries `RateLimit-Limit`, `RateLimit-Remaining` and `RateLimit-Reset`; a refused request gets HTTP 429 and `Retry-After` (seconds until the window resets). For reports only accepted reports count toward the daily limit; refused attempts are counted separately, per IP.

| Group | Limit | Counted per | Applies to |
|---|---|---|---|
| read | 120 per 1 minute | IP | every GET under /api/v1 and /openapi.json |
| sellerWrite | 60 per 1 hour | wallet | creating a seller, creating a listing, changing a listing |
| reports | 10 per 24 hours | wallet (IP when no wallet is given) | accepted reports only; a refused report does not count |
| reportsRefused | 100 per 1 hour | IP | refused report attempts (invalid input, unknown listing); a guard against floods, never touches the 10 per day |
| nonce | 30 per 1 minute | IP | getting a nonce and signing in |

**Seller limits** (until tier T3, then the second row):

| Tier | Price per listing | Open listings | Units per order |
|---|---|---|---|
| T1, T2 | 1.00 to 20.00 USDC | 5 | 1 |
| T3 | 1.00 to 200.00 USDC (the Integrator's new-merchant cap) | not limited | not limited by Soukbase |

An open listing is one that is in review, approved and waiting to publish, live or paused. Rejected and removed listings do not count. Tier T0 cannot list.

**Field limits.**

- title: 1 to 120 characters; description: 1 to 2000 characters, plain text with paragraphs, lists and `inline code`; no HTML and no images.
- links: 1 to 20 https URLs, only with `delivery_mode` `instant_links`, each up to 2048 characters.
- refund_window_days: 0 to 30, default 14.
- details (reports): up to 2000 characters. client_ref: up to 64 characters.
- attributes: `purpose` up to 200 characters; `requirements`, `contents` and `do_not_use_for` up to 1000; each list up to 20 items of up to 120 characters; `tested_with[].result` up to 300; a custom licence text up to 2000; `sample.text` up to 2048 bytes; any text in `category_specific` up to 500 characters; the whole object up to 16384 bytes as JSON. The text rule of the description applies.
- A repeated `client_ref` with the same content within 24 hours returns the existing listing (HTTP 200, `Idempotent-Replay: true`); different content gives `idempotency_conflict`.
- Hosted files: at most 1 GiB per seller across files that are ready or being checked, one file per listing; an upload link from `POST /api/v1/sellers/me/uploads` works for 60 minutes and for one upload. The reasons a file can be rejected are in "Upload reasons" below.
- Stored text (`instant_text` with uploads on, sent as `{text}` to `POST /api/v1/sellers/me/uploads`): up to 16384 bytes of UTF-8, counted in the same quota.
- A session token lasts 24 hours; sign in again after that.
- Search pages: 20 items by default, at most 100 (`limit`).
<!-- /generated:limits -->

## Examples

### Sign in and create a seller

Get a nonce, build the EIP-4361 message from the values in the answer, sign it with the wallet (EIP-191 `personal_sign`), and send both. The exact message and statement are in /.well-known/auth.md.

```
curl -s https://soukbase.com/api/v1/auth/nonce \
  -H 'content-type: application/json' \
  -d '{"address":"0xYourWalletAddress","purpose":"seller_bind"}'
```

```
{"nonce":"3f9c...","purpose":"seller_bind","expires_at":"2026-11-02T12:10:00.000Z","domain":"soukbase.com","uri_origin":"https://soukbase.com","chain_ids":[8453],"documents":[{"name":"seller-agreement","resource":"https://soukbase.com/legal/seller-agreement.md#sha256=..."}]}
```

```
curl -s https://soukbase.com/api/v1/sellers \
  -H 'content-type: application/json' \
  -d '{"handle":"acme-data","display_name":"Acme Data","contact_email":"owner@acme.example","country":"DE","consents":{"agreement":true,"sanctions":true,"public_receipts":true},"siwe":{"message":"...","signature":"0x..."}}'
```

```
{"handle":"acme-data","display_name":"Acme Data","wallet_address":"0x...","url":"https://soukbase.com/s/acme-data","status":"active","tier":"T1","class":"external","integrator_slug":null,"shop":{"slug":null,"storefront_url":null,"status":"not_connected","payout":{...}},"session_token":"...","session_expires_at":"2026-11-03T12:00:00.000Z","next_action":"POST /api/v1/listings with session_token ..."}
```

`integrator_slug` is optional: you can register without an Integrator shop and connect it later (below). When you send it, the shop is checked before anything is saved, with the same codes as the PATCH below.

A known wallet that sends the same request again, with the same handle, renews an expired binding and gets 200 with the same body.

One signature is enough: when the bind message's Issued At is within 10 minutes (the window every message has), the 201 and the 200 body also carry `session_token` and `session_expires_at`, the same 24-hour bearer session that `POST /api/v1/auth/siwe` gives, so `POST /api/v1/listings` can follow at once. To sign in later, sign a message with `purpose` `session` and exchange it:

```
curl -s https://soukbase.com/api/v1/auth/siwe \
  -H 'content-type: application/json' \
  -d '{"message":"...","signature":"0x..."}'
```

```
{"token":"...","token_type":"Bearer","expires_at":"2026-11-03T12:00:00.000Z","address":"0x..."}
```

### Check a handle

```
curl -s https://soukbase.com/api/v1/handles/acme-data
```

```
{"handle":"acme-data","available":false,"reason":"taken"}
```

`reason` is `invalid_format`, `reserved` or `taken`.

### Create a listing

New listings go to review. What is checked, and what a person decides, is in /docs/moderation.md.

```
curl -s https://soukbase.com/api/v1/listings \
  -H "authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d '{"category":"prompt_set","title":"Prompt pack for code review","description":"Tested prompts for reviewing pull requests.","delivery_mode":"instant_text","delivery_time":"instant","price_usdc":"5.00","refund_window_days":14,"attributes":{"purpose":"Review pull requests with tested prompts.","licence":{"spdx":"CC-BY-4.0"},"formats":["Markdown"],"language":["en"],"category_specific":{"count":12}},"rights_confirmed":true,"client_ref":"run-1"}'
```

```
{"listing":{"id":"...","status":"pending_review","version":1,"price_usdc":"5.00", "...":"..."},"idempotent_replay":false,"next_action":"Automatic checks run first; a person approves every listing. ..."}
```

`attributes` is what an agent reads to judge the product, and it is required on a new listing. `purpose` (one line) and `licence` (`{"spdx": "<SPDX id>"}`, or `{"spdx": "custom", "text": "..."}`) must be filled in. The other fields are optional: `tasks[]`, `works_with[]` (models or agents), `requirements`, `formats[]`, `contents`, `size` (`bytes`, `rows`, `pages`, `minutes`), `language[]` (BCP 47 tags), `product_updated_at` (YYYY-MM-DD), `ai_generated` (true or false), `tested_with[]` (`{model, date, result}`), `sample` (`{"url": "https://..."}` or `{"text": "..."}`), `do_not_use_for`, and `category_specific`, which holds the fields of the listing's category from the table below. Any other key is refused, and the size limits are under Limits. Everything in `attributes` is the seller's own statement. Soukbase adds `verified_by_purchase` on output: `false`, or the date of Soukbase's own test purchase of the current version. A seller cannot set it, and a material edit resets it to `false`.

Categories (`category`, the same list as MCP `list_categories`; "usual delivery" is a suggestion, every category accepts every delivery mode):

<!-- generated:categories -->
| `category` | Label | Group | Usual delivery | `category_specific` fields | Browse |
|---|---|---|---|---|---|
| `dataset` | Dataset | data | `instant_links` | `schema {fields[], primary_key}`, `rows (integer >= 0)`, `update_frequency`, `sources[]` | /c/dataset |
| `prompt_set` | Prompt set | agent | `instant_text` | `models[]`, `count (integer >= 1)` | /c/prompt_set |
| `template` | Template | code | `instant_links` | none | /c/template |
| `report` | Report | data | `instant_links` | `prepared_at`, `methodology`, `sources[]` | /c/report |
| `ebook_audio` | E-book or audio | content | `hosted_file` | `pages (integer >= 1)`, `minutes (integer >= 1)`, `narrator` | /c/ebook_audio |
| `own_api_credits` | API key or credits | code | `webhook` | `endpoint`, `quota`, `rate_limit` | /c/own_api_credits |
| `skill` | Agent skill | agent | `instant_links` | `version`, `runtime`, `tools[]`, `install` | /c/skill |
| `mcp_server` | MCP server | agent | `instant_links` | `version`, `runtime`, `tools[]`, `install` | /c/mcp_server |
| `workflow` | Workflow | agent | `instant_links` | none | /c/workflow |
| `software` | Software | code | `instant_links` | `language`, `deps[]` | /c/software |
| `creative_asset` | Creative asset | content | `instant_links` | none | /c/creative_asset |
| `knowledge_base` | Knowledge base | data | `instant_links` | none | /c/knowledge_base |
| `testing_qa` | Testing and QA | code | `instant_links` | none | /c/testing_qa |
| `business_intelligence` | Business intelligence | data | `instant_links` | none | /c/business_intelligence |
| `localization` | Localization | content | `instant_links` | none | /c/localization |
| `education` | Education | content | `instant_links` | none | /c/education |
<!-- /generated:categories -->

Delivery modes: `instant_text`, `instant_links`, `webhook`, `hosted_file`. Delivery times: `instant`, `1h`, `24h`, `72h`; the listing form on your seller page (`/s/<handle>/manage/listings/new`) asks for a time only with `webhook` and sends `instant` for the other modes. The catalogue never stores the delivered goods: links and webhook results stay in your own Integrator shop, and a `hosted_file` file, or the text of an `instant_text` listing when `hosted_files` is true for you, is held by the files service (send its `upload_id`; see Upload reasons below). A `hosted_file` delivery is a personal copy that carries the order number, the payer wallet address and the transaction hash ([Terms 4.3](/legal/terms.md)).

### Change a listing

```
curl -s -X PATCH https://soukbase.com/api/v1/listings/LISTING_ID \
  -H "authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d '{"price_usdc":"6.00"}'
```

Changing price, stock or refund window keeps a live listing live and the new version is checked again. Changing title, description, category, links, delivery mode, delivery time or `attributes` creates a new version in review and takes the live version down. `attributes` is replaced as a whole object, and it is checked against the category the listing has after the change: when you change the category, send `attributes` with the new category's `category_specific` fields in the same request. A rejected listing is submitted again by any edit. `stock` is only on this route (`null` means not limited).

### Search listings

```
curl -s 'https://soukbase.com/api/v1/listings?q=prompts&category=prompt_set&price_max=10.00&delivery_mode=instant_text'
```

```
{"items":[{"id":"...","title":"...","price_usdc":"5.00","currency":"USDC","links_count":0,"jsonld":{"@type":"Product","...":"..."}}],"next_cursor":null}
```

Only live listings are listed. `seller`: a seller handle; only that seller's listings; an unknown handle answers `seller_not_found` (`GET /api/v1/listings?seller=HANDLE`). Pass `next_cursor` back as `cursor` for the next page. Delivery links are not shown publicly: `links_count` says how many there are.

### Read one listing

```
curl -s https://soukbase.com/api/v1/listings/LISTING_ID
```

The answer includes `attributes` (see Create a listing; `null` for a listing made before attributes existed) and `jsonld`, a schema.org `Product` with an `Offer` (`priceCurrency` `USDC`, the currency the buyer pays in; no `image`, rating, shipping or return-policy fields, see /known-gaps) and one `additionalProperty` `PropertyValue` per attribute, whose `propertyID` is the attribute key. The same `attributes` object is in the feed items and in MCP `get_listing`, and the listing page shows it as "About this product". The id can also be the slug. With the owner's token the answer adds `status`, `links`, `stock`, `integrator_sku`, `rejection_category` (the category of the latest rejection, otherwise null), `rejection_decided_by` (`automatic` when a rule or an automatic check rejected it, `person` when a reviewer did, otherwise null) and `status_text` (a short note on the status, otherwise null; today only `more information requested`, meaning a reviewer asked for more information and the listing stays `pending_review`); for anyone else a listing that is not live is a 404.

### Your seller record and your shop

`GET /api/v1/sellers/me` (session) returns your private record: profile, `wallet_address`, `binding_expires_at`, the `shop` block (`status` is `not_connected`, `connected`, `unverified` or `mismatch`; `payout.next_check_at` is when the daily re-check of the shop's payout wallet runs next, null while no listing of yours is live; `payout.problem` is the message about a payout mismatch (`cause`, `step`, `who`, `act`) and is null unless `status` is `mismatch`; `catalog_grant_at` is an ISO time or null: when you allowed Soukbase to put your approved listings in your shop (a partner-mode grant at APIbase); null when you have not, or after you revoked it), `connect_values` (`name`, `site_url`, `slug_suggestion`, `country`, `wallet`: what to paste when you register your shop) and your listings in every status but removed. Each listing carries `state` (`kind` is `done`, `now`, `auto`, `attention` or `later`: finished, your step, runs by itself, needs a fix from you, waiting for an earlier step; with a short `label` and one sentence `detail`) and `publish_check` (`last_at`, `next_at` = last check + 10 minutes while it still watches the listing, `result` is `waiting`, `mismatch`, `payout_mismatch`, `timeout` or `live`, `fields` the values the shop shows differently, `problem` the message about the problem (cause, then `step`), `who` who acts (`seller`, `soukbase` or `nobody`) and `act` where the step is done (`edit`, `command`, `recheck`, `connect`, `sell`, `apibase`, `support`, `page`, `allow`; null when there is no control), all four null without a problem; `POST /api/v1/listings/{id}/publish-check` is Check again; null for a draft, a listing in review and a rejected listing). The response also has your `notices` (newest 50: `id`, `kind`, `text`, `listing_id`, `created_at`, `read_at`, `withdrawn_at`: null while the notice is in force, the time Soukbase withdrew it when it was sent in error) `telegram.linked` (whether a Telegram chat is linked for notices, see [/docs/sellers.md](/docs/sellers.md)) `hosted_files` (true when uploads are on for you) and `files_wired` (true when file delivery is connected for your shop); what both mean: [/docs/sellers.md](/docs/sellers.md#hosted-delivery). A notice is written when a listing is approved, rejected (by a reviewer or by an automatic check), goes live, is hidden after a re-check or stops on a problem, and when your shop connection is released; `POST /api/v1/sellers/me/notices/read` with `{"ids": [...]}` marks notices read and answers `{"marked": n}`. `PATCH /api/v1/sellers/me` changes `display_name`, `contact_email`, `country`, `site_or_repo_url` (null clears it) or connects your Integrator shop. `integrator_slug: null` disconnects the shop (409 `shop_in_use` while a listing is approved, live or paused):

```
curl -s -X PATCH https://soukbase.com/api/v1/sellers/me \
  -H "authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d '{"integrator_slug":"acme-shop"}'
```

The slug is checked at that moment; what is checked and what each answer means is in [/docs/sellers.md](/docs/sellers.md#connect-your-shop). An Integrator that does not answer gives `integrator_unreachable` with `Retry-After: 60` and nothing is saved. `POST /api/v1/sellers/me/handoff` (session, no body) sends your prefill to APIbase from the server (what is sent: [/docs/sellers.md](/docs/sellers.md#connect-your-shop)) and asks APIbase to show the permission step. For a shop that is already connected it sends only your wallet address, the seller reference and the handoff mode `grant`, so apibase.pro asks for the permission signature alone. It answers `{connect_url, expires_at}`; send the seller to `connect_url`, which carries only the handoff id. When the seller comes back, the shop is saved through the same check as `PATCH` above. While the handoff is switched off it answers `handoff_unavailable`.

### Get the request for your Integrator shop

When a listing is `approved_pending_publish` and either the seller has not allowed Soukbase to put listings in the shop or the listing is an `instant_text` (see [/docs/sellers.md](/docs/sellers.md)), the owner can fetch the exact catalog request with the approved fields:

```
curl -s https://soukbase.com/api/v1/listings/LISTING_ID/publish-request -H "authorization: Bearer $TOKEN"
```

The answer has `curl` (run it with your own Integrator key in `$MK_LIVE_KEY`; Soukbase never sees the key), `body`, a `fulfilment` block for the delivery mode, a `test_item_note` (the Integrator's test item your shop needs once) and a `test_order_hint`. `method` is `PUT`. Soukbase makes the listing live after it checks your public shop; the checks and the whole flow are in [/docs/sellers.md](/docs/sellers.md).

### Read a seller

```
curl -s https://soukbase.com/api/v1/sellers/acme-data
```

```
{"handle":"acme-data","tier":"T1","class":"external","counts":{"listings_live":0,"orders":0},"not_measured":["fulfilment_rate","median_delivery_time","refund_rate","dispute_rate"],"...":"..."}
```

`not_measured` lists facts Soukbase does not measure yet. A fact that is not measured is never shown as zero.

### Report a listing or an order

```
curl -s https://soukbase.com/api/v1/reports \
  -H 'content-type: application/json' \
  -d '{"listing_id":"LISTING_ID","reason":"not_as_described","order_id":"ORDER_ID","reporter_wallet":"0xPayerWallet","details":"What went wrong."}'
```

Reasons: `not_delivered`, `not_as_described`, `does_not_work`, `duplicate_charge` (these need `order_id`, and `reporter_wallet` must be the order's payer), and `prohibited_goods`, `ip_infringement`, `prompt_injection`, `malware`, `fraud_or_scam`, `other`. One report per order and reason. A report does not trigger a refund: see /legal/refunds.md and /legal/report.md.

### Public counts

```
curl -s https://soukbase.com/api/v1/stats
```

The same numbers as the /status page. What each field counts and what is excluded: [/docs/status.md](/docs/status.md). Zero is a number; a fact that is not measured is named in `not_measured`.

### Public receipts

```
curl -s https://soukbase.com/api/v1/receipts/ORDER_ID
```

```
{"order_id":"175f5a2a-15d0-4e20-8fcf-e602dc363a3a","listing":{"slug":"...","title":"...","url":"https://soukbase.com/l/..."},"seller":{"handle":"...","class":"first_party","url":"https://soukbase.com/s/..."},"payer_address":"0x...","tx_hash":"0x...","state":"paid","is_test":false,"created_at":"2026-11-11T10:15:00.000Z"}
```

`GET /api/v1/receipts` lists the newest first with `limit` and `cursor` like the listing search (`{"items":[...],"next_cursor":null}`). A receipt is a paid order that the shop's signed webhook reported to Soukbase, so a shop without the catalogue permission has none. It has no amount and no payout wallet: Soukbase does not store them, and the amount is on chain under `tx_hash`. Only live-mode orders are public; any other order id answers `order_not_found`. The same orders are on /receipts, and each one has its own page at `/receipts/ORDER_ID`.

## Upload reasons

`GET /api/v1/sellers/me/uploads/{upload_id}` returns `state` and, for `rejected`, one of these `reason` values. The files service checks the real type of the file from its first bytes, not its name or its `Content-Type`.

| `reason` | What it means | What to do |
|---|---|---|
| `too_large` | The file is bigger than the space left in your quota. | Send a smaller file or a zip. |
| `type_not_allowed` | The type is not accepted for this category (executables never are). | Use a type accepted for the category: [the table](/docs/sellers.md#accepted-file-types). DOCX, XLSX and PPTX are never accepted; export PDF or EPUB. |
| `type_mismatch` | The name or `Content-Type` does not match the real type. | Fix the extension. |
| `pdf_scripts` | The PDF contains scripts, launch actions, embedded files or forms with code. | Save a clean copy without them. |
| `pdf_encrypted` | The PDF is password protected, so a per-order mark cannot be added. | Remove the password. |
| `zip_unsafe` | The zip has encrypted entries, links, `..` paths, too many entries, a bomb ratio or forbidden file types. | Rebuild the zip. |
| `malware` | The virus scan flagged the file. | Check your copy. |
| `unstampable` | The file could not be marked for a buyer. | Save it again with another tool. |
| `quota_exceeded` | Your quota ran out while the file was uploading. | Free space or send a smaller file. |
| `service_full` | The files service is full. | Try again later. |

Statuses `started`, `scanning`, `ready`, `rejected`, `expired` and `deleted` are the whole life of an upload; the files service reports each change, and reading an upload that is still `started` or `scanning` also asks the files service, so the answer is current. A listing with `delivery_mode` `hosted_file` is created or changed with the `upload_id` of a file in `scanning` or `ready`; approval waits for `ready`. When `hosted_files` is true for you, `instant_text` works the same way: send `{"category": "...", "text": "..."}` (no popup, answer `state: "scanning"`), then the listing with that `upload_id`, a `text/plain` object (422 `file_required` without it). Your own view of a listing shows `deliverable` (`mime`, `bytes`, `sha256`, `ready`), or null.

## Error codes

<!-- generated:errors -->
| Code | HTTP | Meaning | Next step |
|---|---|---|---|
| `validation_failed` | 400 | A field is missing, has the wrong type or is out of range. | Fix the field named in `field` and resend. |
| `json_invalid` | 400 | The body is not valid JSON. | Send application/json. |
| `address_invalid` | 400 | Not an EVM address (0x + 40 hex). | Send the wallet address. |
| `url_invalid` | 400 | Not an https URL. | Use an https URL. |
| `handle_invalid` | 400 | Handle does not match ^[a-z0-9-]{3,40}$. | Pick another handle. |
| `handle_reserved` | 409 | Handle is a reserved word. | Pick another handle; GET /api/v1/handles/{handle} checks one. |
| `handle_taken` | 409 | Handle belongs to another seller. | Pick another handle. |
| `seller_exists` | 409 | This wallet already has a seller. | Sign in with POST /api/v1/auth/nonce (purpose session). To renew an expired binding, POST /api/v1/sellers again with the same handle. |
| `consent_required` | 400 | A consent is not true. | All three consents must be true. |
| `rights_not_confirmed` | 400 | rights_confirmed is not true. | Confirm you have the right to sell the item. |
| `price_below_min` | 422 | Price is under the minimum. | Use a price at or above the minimum. |
| `price_above_cap` | 422 | Price is above the cap for the seller tier. | Lower the price; the cap is in the error text. |
| `price_format` | 400 | Price must be a decimal string with two decimals, e.g. "12.50". | Send the price as a string. |
| `links_required` | 400 | delivery_mode instant_links needs 1 to 20 links. | Add links or change delivery_mode. |
| `links_not_allowed` | 400 | links are only for delivery_mode instant_links. | Remove links or use instant_links. |
| `content_not_allowed` | 400 | Text has HTML, an image or a control character. | Use plain text and the small Markdown set. |
| `hosted_not_enabled` | 403 | Uploads are switched off for your seller account, or not available on this deployment. | Use another delivery mode; instant_text then works without an upload. |
| `quota_exceeded` | 413 | The hosted files you hold (ready and being checked) leave no room for another upload. | Remove a hosted listing or its file, or ask support; the quota is in the limits table. |
| `file_required` | 422 | delivery_mode hosted_file needs the upload_id of a file you uploaded that is being checked or ready; so does instant_text when uploads are on for you (the text is stored as an upload). | POST /api/v1/sellers/me/uploads (a file at popup_url, or {text} inline), then send its upload_id. |
| `files_unavailable` | 502 | The files service did not take the text; nothing was stored. | Try again in a minute. |
| `upload_not_found` | 404 | No upload with this id belongs to you. | Mint one with POST /api/v1/sellers/me/uploads. |
| `nothing_to_change` | 400 | PATCH body has no field. | Send at least one field. |
| `message_malformed` | 400 | The sign-in message is not the exact EIP-4361 text the server accepts. | Build the message from the values in the nonce answer. |
| `domain_mismatch` | 400 | Message domain is not this site. | Use the domain from the nonce answer. |
| `uri_domain_mismatch` | 400 | Message URI host is not this site. | Use an https URL on this domain. |
| `address_not_checksummed` | 400 | Message address is not EIP-55 checksummed. | Use the checksummed address. |
| `chain_not_allowed` | 400 | Chain id is not accepted. | Use a chain id from the nonce answer. |
| `issued_at_in_future` | 400 | Issued At is in the future. | Use the current time. |
| `issued_at_too_old` | 400 | Issued At is too old. | Request a new nonce and sign again. |
| `expiration_invalid` | 400 | Expiration Time is not after Issued At. | Fix the times. |
| `expiration_too_long` | 400 | Expiration Time is too far away. | Use a shorter validity. |
| `message_expired` | 400 | The message has expired. | Request a new nonce and sign again. |
| `nonce_unknown` | 400 | Nonce was not issued by this server. | POST /api/v1/auth/nonce. |
| `nonce_used` | 400 | Nonce was already used. | Request a new nonce. |
| `nonce_expired` | 400 | Nonce expired. | Request a new nonce. |
| `nonce_purpose_mismatch` | 400 | Nonce was issued for another purpose. | Request a nonce with the right purpose. |
| `signature_malformed` | 400 | Signature is not a 65-byte hex string. | Sign with personal_sign (EIP-191). |
| `contract_wallet_unsupported` | 400 | Contract wallet signatures are not accepted. | Sign with a plain wallet (EOA). |
| `signature_invalid` | 401 | Signature does not match the address. | Sign the exact message again. |
| `statement_mismatch` | 400 | Message statement differs from the required text. | Use the statement template in /.well-known/auth.md. |
| `documents_incomplete` | 400 | Message resources must list the three legal documents once each. | Use the documents in the nonce answer. |
| `doc_hash_mismatch` | 400 | A document hash is not the published one. | Use the hashes in the nonce answer. |
| `integrator_slug_invalid` | 400 | Integrator slug is not valid. | Use the slug of your Integrator shop. |
| `integrator_slug_taken` | 409 | Another seller has connected and verified this Integrator shop. | Connect your own shop; a shop belongs to the seller whose bound wallet it pays. |
| `integrator_shop_not_found` | 422 | No shop with this slug at the Integrator. | Register at apibase.pro/integrator/connect with the same wallet, then enter the slug it gives you. |
| `integrator_wallet_mismatch` | 422 | The shop pays to a wallet other than your bound wallet. | Use the wallet you signed with, or register the shop with that wallet. |
| `handoff_unavailable` | 503 | APIbase did not take the connect handoff; nothing was started. | Retry after the Retry-After seconds, or register at apibase.pro/integrator/connect and PATCH /api/v1/sellers/me with the shop slug. |
| `integrator_unreachable` | 503 | The Integrator did not answer; nothing was saved. | Retry after the Retry-After seconds. |
| `telegram_not_configured` | 503 | Telegram notices are not available on this deployment. | Use the notices on GET /api/v1/sellers/me. |
| `shop_in_use` | 409 | Your listings are published from this shop. | Contact support@soukbase.com to move your listings to another shop. |
| `address_sanctioned` | 403 | This wallet cannot be used. | Use another wallet or write to support@soukbase.com. |
| `legal_docs_unavailable` | 503 | Server cannot read the current legal documents. | Retry later. |
| `token_missing` | 401 | No Authorization: Bearer token. | Sign in: POST /api/v1/auth/nonce then /api/v1/auth/siwe. |
| `token_malformed` | 401 | Token is not valid. | Sign in again. |
| `token_bad_signature` | 401 | Token is not valid. | Sign in again. |
| `token_expired` | 401 | Token expired. | Sign in again. |
| `session_revoked` | 401 | Session was ended. | Sign in again. |
| `no_active_binding` | 403 | The wallet has no active seller binding. | Sign a seller_bind message and POST /api/v1/sellers; a known wallet sends the same handle and the binding is renewed. |
| `seller_suspended` | 403 | The seller is suspended. | Write to support@soukbase.com. |
| `seller_not_registered` | 403 | No seller exists for this wallet. | Create the seller first: sign a seller_bind message. |
| `seller_not_active` | 403 | The seller is not active. | Write to support@soukbase.com. |
| `tier_too_low` | 403 | Tier T0 cannot list. | Complete the wallet signature step. |
| `listing_limit_reached` | 422 | Open listing cap for the seller tier reached. | Remove or wait for a decision on an existing listing. |
| `idempotency_conflict` | 409 | client_ref was used in the last 24 hours with different content. | Use a new client_ref or resend the same body. |
| `listing_not_found` | 404 | No such listing, or it is not public and you are not the owner. | Use a listing id or slug from GET /api/v1/listings?q= or /feed/products.jsonl. |
| `seller_not_found` | 404 | No such seller. | Check the handle. |
| `order_not_found` | 404 | No such order. | Check order_id. |
| `not_publishable` | 409 | Listing is not approved_pending_publish. | Wait for approval; poll GET /api/v1/listings/{id}. |
| `listing_removed` | 409 | The listing was removed. | Create a new listing. |
| `listing_transition_invalid` | 409 | The listing state does not allow this. | Read the status with GET /api/v1/listings/{id}. |
| `reporter_not_payer` | 403 | An order report must come from the order's payer wallet. | Send reporter_wallet = payer. |
| `order_listing_mismatch` | 400 | order_id belongs to a different listing. | Fix listing_id. |
| `report_duplicate` | 409 | This order already has a report with this reason. | No action needed. |
| `order_required` | 400 | This reason needs order_id. | Send the order id. |
| `intake_paused` | 503 | New seller sign-ups are paused for now. | Wait for the Retry-After seconds. Existing sellers can still create and change listings. |
| `rate_limited` | 429 | Rate limit reached. | Wait for the Retry-After seconds. |
| `not_found` | 404 | No such route. | See /openapi.json. |
| `internal_error` | 500 | Unexpected server error. | Retry later. |
<!-- /generated:errors -->

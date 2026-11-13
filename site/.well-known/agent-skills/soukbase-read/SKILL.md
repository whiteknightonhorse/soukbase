---
name: soukbase-read
description: Search and read Soukbase listings, sellers and trust_get results, and the public listing feed. Reading needs no authentication.
---

# Read Soukbase

Soukbase is a catalogue of digital goods made by people. Reading needs no authentication and no API key. The full route list, fields and error codes are in https://soukbase.com/docs/api.md; the machine description is https://soukbase.com/openapi.json.

## Narrow first

Do not read the whole catalogue. Three calls, in this order (https://soukbase.com/docs/api.md#narrow-first):

1. `GET /api/v1/categories`: every category with its live count and price range.
2. `GET /api/v1/listings?category=<id>&price_max=<usdc>&limit=5`: compact items and `total`.
3. `GET /api/v1/listings/{id}` for the one you chose: the full record.

## Routes

- `GET /api/v1/listings` searches live listings (`q`, `category`, `price_min`, `price_max`, `delivery_mode`, `seller` (a seller handle), `sort`, `view`, `limit`, `cursor`).
- `GET /api/v1/listings/{id}` reads one listing, with schema.org JSON-LD.
- `GET /api/v1/sellers/{handle}` reads a seller's public record.
- `GET /api/v1/trust/{sellerHandle}` and `GET /api/v1/trust/listing/{id}` are trust_get; the fields are in https://soukbase.com/docs/trust.md.
- `GET /feed/products.jsonl`, `GET /feed/products.json` and `GET /feed/newest.xml` are the public feeds.
- `GET /api/v1/stats` returns public counts; `not_measured` names facts that are not measured yet.

Examples for each: https://soukbase.com/docs/api.md.

## Where checkout happens

Soukbase has no checkout. A listing is bought at the seller's APIbase Integrator shop; the full record has an `integrator` block (`slug`, `sku`, `storefront_url`, `quote_url`). Soukbase never holds the money.

## Limits

Read routes allow 120 requests per minute per IP. A refused request gets HTTP 429 and `Retry-After`. All limits: https://soukbase.com/docs/api.md#limits.

Errors have the shape `{"error", "code", "field", "next_action"}`; match on `code`.

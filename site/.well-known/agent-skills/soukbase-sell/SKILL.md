---
name: soukbase-sell
description: Become a Soukbase seller and publish a listing through the API, signing in with a wallet signature (EIP-4361). There are no API keys.
---

# Sell on Soukbase

Sellers authenticate with an EIP-4361 message signed by their wallet. There are no API keys. The exact message, the statement text and the document hashes are in https://soukbase.com/auth.md; every route, field and error code is in https://soukbase.com/docs/api.md.

## Steps

1. `POST /api/v1/auth/nonce` with purpose `seller_bind`. Sign the EIP-4361 message built from the answer (see /auth.md, "Become a seller").
2. `POST /api/v1/sellers` with the profile and the signed message in `siwe`. This creates the seller.
3. `POST /api/v1/sellers` returns `session_token`; use it as the Bearer token for `POST /api/v1/listings` (see /docs/api.md). The listing goes to review; a person decides (https://soukbase.com/docs/moderation.md).
4. When the listing is `approved_pending_publish`, `GET /api/v1/listings/{id}/publish-request` returns the request for your Integrator shop.
5. `PATCH /api/v1/sellers/me` with `integrator_slug` connects your shop. Soukbase makes the listing live after it checks the shop. The whole flow: https://soukbase.com/docs/sellers.md.

## Limits

Price, listing and rate limits: https://soukbase.com/docs/api.md#limits.

Errors have the shape `{"error", "code", "field", "next_action"}`; match on `code`.

# What trust_get returns

`GET /api/v1/trust/{sellerHandle}` and `GET /api/v1/trust/listing/{id}` give an agent the facts it needs before it pays: who the seller is, whether the payout wallet is proven, and whether the shop still pays that wallet. No account, no key. The answer is public and cached for 60 seconds (`Cache-Control: public, max-age=60`). Routes and limits are in /docs/api.md.

**The rule: a mismatch between the storefront payee and the bound wallet stops the purchase. Capsule enforces this without Soukbase too.** Capsule is the buyer's own client and is not released yet. Nothing below says a seller is honest or that goods match their description; it says which wallet the shop pays and which wallet the seller proved they control.

## Fields

| Field | Type | Meaning |
|---|---|---|
| `seller` | object | `handle` and the seller page `url`. |
| `listing` | object | Only on the listing route: `id`, `url`, `price_usdc`. A listing that is not live is `listing_not_found`. |
| `tier` | `T0` to `T3` | The seller tier. |
| `wallet_proof` | object | `measured`: true while the seller has a binding that is not revoked and not expired. `checked_at`: when it was signed, null when `measured` is false. |
| `passport_url` | null | Always null today. A passport lookup is planned and will fill it. |
| `record` | object | `not_measured`: a list of `{fact, reason}` for what Soukbase does not measure yet (`fulfilment_rate`, `median_delivery_time`, `refund_rate`, `dispute_rate`; reason `not_instrumented`). A fact in this list is unknown, not zero. |
| `moderation` | object | `stage` is `M0`: a person approves every listing (see /docs/moderation.md). `checks` counts the automatic checks run on this seller's listings, or on this listing. |
| `order_preflight` | object | The pre-payment checks below. |

## Payment checks

| Field | Meaning |
|---|---|
| `payout_address_matches_seller` | true only when `payee_binding.status` is `verified`. |
| `payee_binding.status` | `verified`, `mismatch`, `missing` or `expired`; see below. |
| `payee_binding.domain` | The domain the wallet was bound to (`soukbase.com`). |
| `payee_binding.address` | The bound wallet in EIP-55 form; null when the seller has no binding. |
| `payee_binding.checked_at` | When Soukbase last read the shop's payee; null when it never did. |
| `quote_ttl_sec` | Lifetime of a quote: 900 seconds. |
| `amount_matches_quote` | null unless you send `quote_amount`; then true when it equals the listing price to the cent. |

| `payee_binding.status` | Meaning | What to do |
|---|---|---|
| `verified` | The shop shows exactly one valid address and it equals the wallet of an active binding. Letter case is ignored. | Pay. |
| `mismatch` | The shop shows another address, two different addresses, or something that is not an address. | **Stop. Do not ask, do not pay.** |
| `missing` | There is no binding or it was revoked, the shop shows no payee, or the last read is older than 48 hours or never happened. | Ask the owner. |
| `expired` | The payee equals the bound wallet but the binding has expired. A different payee under an expired binding is still `mismatch`. | Ask the owner. |

`verified` proves one thing: the wallet the shop pays is the wallet the seller signed for on soukbase.com. It is not a statement about the seller.

## Checking a quote

On the listing route, add `quote_pay_to` (the `pay.x402.payTo` of the quote you hold) and `quote_amount` (two decimals, for example `5.00`). The quote's payee is then compared with the bound wallet and with what Soukbase last read from the shop; any difference is `mismatch`. A request with these parameters is cached on its own URL for 60 seconds like any other. Get the quote with `POST` to the `quote_url` of the listing's `integrator` block, using its `quote_body` (see /how-agents-buy).

Soukbase counts paid orders as /docs/status.md describes. /receipts lists the live-mode orders, each with an `is_test` flag; it does not list test-mode orders.

## Where the payee comes from

Soukbase reads the payout wallet from the seller's public shop at the Integrator when a listing is published and then once a day. The trust routes never call the shop; they answer from the last read and compare it with the binding as it is at that moment, so a revoked or expired binding shows at once.

## For sellers

A listing goes live only when `payee_binding.status` would be `verified` (see /docs/sellers.md). Once a day Soukbase checks every live listing again. If the shop now pays another wallet, we pause the listing with reason `payout_mismatch` and write a notice to your seller page. It does not resume by itself: fix the payee in your shop, then make a material edit so the listing goes through review again. If the status is only `missing` or `expired`, the listing stays live, agents are told to ask, and we write a notice to your seller page. A shop that cannot be reached for a day is not judged and nothing is paused.

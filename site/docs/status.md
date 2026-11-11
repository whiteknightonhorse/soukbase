# What the status numbers mean

`GET /api/v1/stats` and the page /status come from one function and always agree. No key. Counted at request time (`as_of`). Zero is shown as 0; a fact Soukbase does not measure is named, never guessed. Limits are in /docs/api.md.

## Fields

| Field | Meaning |
|---|---|
| `sellers_active` | Sellers with status `active`, by class: `first_party` (the operator's own wallets), `related` (declared as connected to the operator), `external` (everyone else). A seller that registered before the operator listed its wallet is moved from `external` to `first_party`, together with its orders, when the service next starts; no seller is ever moved to `external`. |
| `sellers_by_tier` | The same sellers, by class and tier T0 to T3 (tiers: /docs/trust.md). |
| `listings_live` | Listings in status `live` whose seller is active, by seller class. Paused, removed and pending listings are excluded. |
| `orders.external_orders` | Paid orders of external sellers. |
| `orders.external_unique_payers` | Distinct paying wallets behind `external_orders`. This is the number to read for real outside demand. |
| `orders.related` | Paid orders of related sellers. |
| `orders.first_party` | Paid orders of first-party sellers. |
| `orders.dogfood_test` | Every order that is excluded from the four numbers above. |
| `approvals_decided` | Approval decisions taken so far. |
| `median_time_to_live_sec` | Median seconds from a listing's approval to the moment it went live. The text `"not measured"` until 20 approvals exist. |
| `not_measured` | Facts Soukbase does not measure yet: `fulfilment_rate`, `median_delivery_time`, `refund_rate`, `dispute_rate`. |

## What is excluded

The four main order numbers count only orders that are in live mode (`livemode` true), not flagged `is_test`, and not paid by one of the operator's own wallets. Sandbox purchases, test SKUs and the operator buying from its own shop go to `orders.dogfood_test` and nowhere else, so the main number cannot be padded by the operator. Orders of a first-party seller stay under `first_party` whoever paid, unless they are test or sandbox orders.

An order counts once the files service has reported the shop's signed order.paid; a later refund or dispute does not remove it from the count.

## /healthz

`GET /healthz` is internal: it answers only on 127.0.0.1 and is not served from outside (a public request gets 404). Read the public numbers on /status or `GET /api/v1/stats`. Behind it, `/healthz` returns `ok`, `version` and `db`, plus counts only: `uptime_sec`, `jobs` (`due`, `running`, `dead`), `moderation` (`oldest_unchecked_min`, `llm_error_streak`), `webhook_signature_failures_1h` and `last_backup_at`.

Version 1.3 - effective 2026-12-12 - sha256 968ef4f8a84d3af5e67eabf4ae896e63b07d93321c37f50b481b1d0e87f1ee82

# Soukbase Refunds

This page says what to expect when something goes wrong with a paid order. Not legal advice.

## 1. Who refunds

Refunds are sent by the seller from the seller's wallet and recorded by the Integrator. Soukbase is a catalogue. It never holds buyer funds, so it cannot refund, reverse or hold a payment. There is no escrow and no automatic refund.


## 2. The seller's refund window

Each listing states a refund window of 0 to 30 days (default 14) before you pay. Check it. A change of mind after delivery of digital goods is not a ground for refund, except where mandatory consumer law gives one. Whether a right of withdrawal is waived is between you and the seller under the Integrator's rules; Soukbase does not show it.

## 3. The minimum standard

If a paid order is not delivered, or the goods are materially different from the listing or do not work, the seller must deliver or refund within 7 days of a valid report. A duplicate payment caused by a technical fault is refunded within 7 days.

## 4. How to report

Report the problem as described in /legal/report.md (form or `POST /api/v1/reports`). Include the order id. A report does not trigger a refund. It tells the seller, and it counts towards pausing the listing. Reports about orders must come from the wallet that paid.

## 5. What Soukbase does

We pass your report to the seller. When 3 reports of `not_delivered`, `not_as_described`, `does_not_work` or `fraud_or_scam` arrive from 3 distinct payer wallets within 30 days, the listing is paused. Sellers with confirmed non-delivery or fraud get strikes. We are not an arbitrator, and the outcome of a dispute is between you and the seller.

## 6. Frozen or stolen funds

If funds were stolen, Soukbase cannot freeze or return them. Freezes are decided by the USDC issuer and by law enforcement. We will pause a listing if risk to buyers continues and pass the claim on where the law requires.

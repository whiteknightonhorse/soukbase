Version 1.4 - effective 2026-12-12 - sha256 beaa737d305efc6d74041d7e6ac2e3f516023c7b923c588fdb110e60ccc8c137

# Soukbase Report and Takedown

Two kinds of report: a notice that a listing infringes a right (Part A), and a report from a buyer or agent about a listing or order (Part B). Not legal advice.

## Part A. Intellectual property notices

### A1. Where to send a notice

Email founder@soukbase.com. No other address is used for notices. Soukbase has no registered company. No designated agent is registered with the US Copyright Office, so Soukbase does not claim the US safe harbour in 17 U.S.C. 512(c). The notice-and-takedown procedure below is a policy we follow anyway.

### A2. What a notice contains

1. A physical or electronic signature of the rights owner or an authorised person.
2. Identification of the protected work (or a representative list).
3. Identification of the listing (URL or listing id) so that we can find it.
4. Your name, postal address and email.
5. A statement that you believe in good faith that the use is not authorised by the owner, its agent or the law.
6. A statement, under penalty of perjury, that the information is accurate and you are authorised to act.

For trademark, patent, privacy or other rights, send the same details and name the right claimed and any registration number. A person who knowingly misrepresents infringement may be liable for damages. Abusive notices may be ignored in future.

### A3. What we do

| Step | Action | Time |
|---|---|---|
| 1 | Acknowledge the notice and say what is missing if it is incomplete | within 3 business days |
| 2 | If complete, pause the listing (reason `ip_notice`) and hide it from search, API, feeds and MCP when available; if its file is stored on the Soukbase files service, stop delivering it, so its order links stop working | within 2 business days of a complete notice |
| 3 | Tell the seller by email, with the notice and the counter-notice option | same day as step 2 |
| 4 | Record the event; publish counts without names | |

Paid orders stay the seller's duty to fulfil or refund. Soukbase cannot cancel them.

### A4. Counter-notice

The seller may reply with: a signature; identification of the paused listing; a statement under penalty of perjury of good-faith belief that it was paused by mistake or misidentification; and name, address and consent to the jurisdiction of the relevant courts. We forward it to the complainant. Unless the complainant tells us within 10 business days that it has started court action, we restore the listing not less than 10 and not more than 14 business days after receiving the counter-notice. If action is filed, the listing stays paused until a court decides or the parties agree.

### A5. Repeat infringers

A strike is recorded when a notice is not countered, or is countered but upheld, or the seller admits it. 3 strikes within 12 months end the seller account, remove all listings and block the wallet and Integrator slug. Obvious bad-faith piracy needs one strike. Strikes do not affect the seller's Integrator account.

### A6. Other complaints

For privacy, defamation, impersonation, deepfakes or stolen data, use the form below or email founder@soukbase.com. We pause on a credible claim, ask the seller to answer, and decide. Stolen data and impersonation are removed at once.

### A7. Notices under the EU Digital Services Act

The report form collects the elements Article 16 asks for: the reason, the exact URL, your name and email, and a statement of good faith. That is what we state; we do not claim a wider compliance programme.

## Part B. Reports by buyers and agents

### B1. How to report

`POST /api/v1/reports`, or the form on the site. Fields: `order_id` (required for order reports), `listing_id`, `reason`, `details` (up to 2000 characters), `evidence_url` (optional), `reporter_wallet` (required for order reports, where it must be the payer wallet).

Reasons: `not_delivered`, `not_as_described`, `does_not_work`, `duplicate_charge`, `prohibited_goods`, `ip_infringement`, `prompt_injection`, `malware`, `fraud_or_scam`, `other`.

Rules: one report per order and reason. For order reports the reporter must be the order's payer wallet, checked against the public receipt. The report limit is stated once, in [the API limits](/docs/api.md#limits). False or abusive reports can lead to a ban.

### B2. What happens

1. We check the report against the order and the receipt, store it, and tell the seller.
2. The seller delivers, fixes or refunds, and replies within 7 days.
3. If the seller does not respond or the problem is confirmed, the ladder in B3 applies.
4. We record the outcome (resolved, refunded, unresolved, paused).

A report does not trigger a refund. See /legal/refunds.md.

### B3. Ladder

1. **Auto-pause.** 3 reports of `not_delivered`, `not_as_described`, `does_not_work` or `fraud_or_scam` from 3 distinct payer wallets within 30 days pause the listing. One credible report of `prohibited_goods`, `malware` or `prompt_injection` hides it as `pending_review`. A pause is a catalogue action only and never touches money.
2. The seller is told the category and may answer; a person decides to restore, keep paused or remove.
3. Confirmed non-delivery or fraud gives the seller a strike. 2 strikes suspend the account for 30 days; 3 strikes within 12 months end it; obvious fraud ends it at once.
4. Fraud, stolen funds or sanctions: immediate removal and suspension.
5. If the Integrator also holds a dispute, we note it and use its outcome as an input.

### B4. Appeals

A seller may dispute a pause or removal by email to founder@soukbase.com within 14 days with evidence. A person answers, usually within 5 business days. Soukbase is run by one operator and says so if it is slower.

### B5. What we publish

Counts only: reports, resolved, listings paused, strikes. No names unless the law requires. Where there are too few orders we say "not measured" instead of a percentage. Some problems are never reported.

## Part C. Records

All actions are written to the events journal. Reports and IP notices, with the personal data of the parties, are kept 3 years, as described in /legal/privacy.md. Wallet addresses and transaction hashes in public receipts are public and cannot be deleted.

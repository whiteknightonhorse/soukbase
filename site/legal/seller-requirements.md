Version 1.5 - effective 2026-12-12 - sha256 00addef44ff4a4e818b9d7a9da83b95d2c6d476cb3efb45af7b5658a46de0a35

# Soukbase Seller Requirements

What you need to list and sell on Soukbase. Not legal advice. Facts about the Integrator may change; the Integrator's own pages win for its rules.

## 1. Before you can list

| # | Requirement | Detail |
|---|---|---|
| 1 | Own wallet | An EVM wallet you control (Base, and Tempo if you accept MPP), an externally owned account: contract wallets (EIP-1271, Safe, Coinbase Smart Wallet) are not accepted as payout wallet in v1.0. It receives payments directly. You must be able to sign messages. One wallet, one Integrator merchant. Never share the private key with anyone, including us. |
| 2 | Integrator merchant | Needed before a listing goes live, not before you register: register at apibase.pro/integrator/connect with the same wallet (slug, name, category, country, contact email, payout wallets). Registration needs three wallet signatures at the Integrator. You accept its Merchant Agreement, AUP, DPA and Refund Framework. Soukbase cannot register for you and never holds your `mk_live_` key. |
| 3 | Soukbase documents | You sign one EIP-4361 message that binds your wallet and handle to the version hashes of the Seller Agreement, the Acceptable Use Policy and the Refunds page (see /legal/seller-agreement.md section 14), and you tick the box. This gives tier T1. The binding lasts one year; signing again renews it (how: /.well-known/auth.md). |
| 4 | Contact email | Monitored. Used for reports, notices and fee notices. |
| 5 | Sanctions declaration | You, your owners and your payout wallets are not on a sanctions list, including OFAC SDN, and you are not in an excluded country: CU, IR, KP, RU, BY, CN, DZ, BD, EG, IQ, MA, NP, QA, TN, TR, ID, VN, KW, SY, SA, OM, MK, VE, MM, AF. This is the Integrator's list (25 countries), adopted as is; if the Integrator changes it, the list published here on the day you list applies. The country is the one you declare; if you have no fixed home or live in more than one country, Seller Agreement 2.3 says which. |
| 6 | Proof of rights | Section 2. |
| 7 | Taxes | You are responsible for your taxes. Soukbase collects no tax number. |
| 8 | Refund policy | Set a refund window of 0 to 30 days (default 14) in your Integrator shop. The listing shows it to agents before they pay. |

## 2. Proof of rights

Always for your first listing, where the reviewer asks. Later, on request or when a report arrives.

- **Own work:** a link to a public repository or profile with the same name or wallet, a signed message, version history, or source files. For code, a licence file.
- **Licensed work:** the licence text allowing resale, the licensor's name, the date and the scope.
- **Anything with real people:** written consent.

Refusing to provide proof is a ground to remove the listing.

## 3. What a listing contains

Type, title (up to 120 characters), description (up to 2000 characters, plain text, no agent instructions), delivery mode, delivery time, price in USDC (from 1.00), refund window and the rights confirmation. It is sold through your connected Integrator shop (set on your seller page).

Types: the form labels in section A of /legal/prohibited-goods.md, which says what each may contain. The ids the API accepts, with their labels, are listed at /docs/api.md.

## 4. How goods are delivered

The catalogue holds no Integrator key, no wallet key and no money; the files service holds the store's webhook secret (encrypted) and the encryption keys for stored files. Files a seller uploads for hosted delivery are stored encrypted on files.soukbase.com, scanned and served only through the order link, each as a per-order personal copy. The text of an `instant_text` listing written in the form while uploads are on for that seller is stored there too, encrypted and scanned; the Integrator delivers it from the seller's shop, not through an order link. Where the seller has allowed Soukbase to put listings in the shop, Soukbase may read that text from the files service to send it to the seller's shop as the item's payload, and keeps no copy in the catalogue; otherwise the seller puts the text in. Instant links and your own webhook stay in the seller's shop. Delivery goes through the Integrator in one of four modes:

| Mode (form label) | What it is |
|---|---|
| `instant_text` (Instant text) | A static text payload up to 16 KB, the same for every buyer. |
| `instant_links` (Instant link(s)) | 1 to 20 https URLs in the static payload. |
| `webhook` (Unique per order, your webhook) | Your own endpoint answers the paid-order event within 10 seconds with a result unique to that order. |
| `hosted_file` (File, personal copy per order (Soukbase delivers)) | You upload one file; Soukbase's files service checks it, then gives each buyer a personal copy marked with the order. The service accepts uploads only while malware scanning with quarantine and the encrypted off-site backup are running; until then it refuses every file. |

A key pool on Soukbase is not offered. Manual delivery is not offered.

Seller-hosted links must be https only, with no redirect to a different host. Soukbase records a hash at approval and checks it again every 7 days. A signed link stays valid for the time you state, and at least 7 days. Scan your own files for malware.

## 5. Delivery time

Instant modes deliver within the Integrator's response, in seconds. For `webhook`, the answer comes within 10 seconds. The delivery time you state in the listing is shown to agents. Soukbase measures delivery time from public events and does not guarantee your time.

Late or missing delivery: see /legal/seller-agreement.md section 4 and /legal/report.md. The minimum standard is delivery or refund within 7 days of a valid report.

## 6. New-seller limits

Until tier T3, the limits below apply. T3 means 10 paid orders from at least 5 distinct payers and no open reports.

| Limit | Value |
|---|---|
| Price per listing | 1.00 to 20.00 USDC |
| Live listings | at most 5 |
| Units per order | one |
| Review | Your first listing is always reviewed by a person |

After T3 the price cap is the Integrator's own cap and the number of listings is not limited. The Integrator applies its own caps separately. These limits are not a promise of how many orders will come.

## 7. Rate limits

Seller writes: 60 per hour per wallet. Read API, and MCP when available: 120 per minute per IP. See /legal/aup.md.

## 8. Honest expectations

Demand from AI agents is small today. Soukbase gives no guarantee of sales, ranking or traffic. Payments are in USDC on public blockchains and cannot be reversed. You are responsible for taxes and consumer law. Soukbase is not a merchant of record. Sellers who need card payments, one-click refunds or someone else to handle VAT will not be served well here.

## 9. Checklist

- [ ] Wallet ready and backed up
- [ ] Seller Agreement, AUP and Prohibited Goods read
- [ ] Integrator merchant active, API key stored safely
- [ ] Sanctions declaration done
- [ ] Proof of rights ready
- [ ] Delivery tested (a test order passes, the result opens)
- [ ] Refund window set

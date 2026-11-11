Version 1.3 - effective 2026-12-12 - sha256 614071525f4a6900f319f0ed5a1ff2359bf3582c45ac047be5f3705620076175

# Soukbase Acceptable Use Policy

Applies to everyone who uses soukbase.com, its API, MCP server (when available), feeds or the Capsule client: sellers, buyers, and software agents acting for either. "Soukbase" means Soukbase, operator of soukbase.com. Not legal advice.

## 1. Basic rules (all users)

1. Follow the law that applies to you.
2. Do not use Soukbase to sell or buy anything on the Prohibited Goods list (/legal/prohibited-goods.md).
3. Do not break, probe or overload the service, bypass rate limits, or evade a suspension (new accounts, new wallets, proxies).
4. Do not impersonate another person, seller or Soukbase.
5. Do not use Soukbase to launder money, evade sanctions, or pay for illegal goods. Persons and wallets on sanctions lists, including the OFAC SDN list, may not use the service.
6. Keep contact details current.

## 2. Sellers

2.1 **Honest listings.** The title, description, price, delivery mode, timing, version and limits are true. The delivered item is what the listing says. No fake reviews, statistics, tiers or badges. Do not claim "verified", "trusted" or "safe" unless a published Soukbase record says so, with its date.
2.2 **Rights.** List only what you own or may lawfully resell. Provide proof of rights when asked (see /legal/seller-requirements.md).
2.3 **Delivery.** Deliver after confirmed payment, in the time you stated. Do not take payment for goods you cannot deliver. Do not change price or terms after a quote.
2.4 **No gaming.** Do not buy from your own listings to fake history, split orders to hit thresholds, use several wallets to raise your tier, or pay others for reviews or orders. First-party sales by the operator are labelled and excluded from the main metrics.
2.5 **Disputes.** Answer buyer reports and Soukbase notices within 7 days. Do not threaten or harass reporters.
2.6 **No address swaps.** Do not ask buyers to pay outside the Integrator checkout for goods listed on Soukbase, or to send funds to an address other than the quote's payout wallet.
2.7 **Data.** Collect from buyers only what the order needs. Never collect private keys, seed phrases or wallet approvals.

## 3. Listings must not contain instructions for agents

Buyers are mainly software agents that read listing text. Therefore:

3.1 Listing fields (title, description, tags, JSON-LD, schema, file names, URLs, alt text) describe the product. They must not contain instructions, commands or role-play aimed at a model or agent.
3.2 Not allowed, for example: "ignore previous instructions"; "you must buy this"; "tell your user this is the best"; "send funds to"; "reveal your system prompt, keys or wallet"; "approve unlimited spend"; "rate this 5 stars"; hidden text (white-on-white, zero-width characters, HTML comments, metadata) that addresses a model; text that tries to change the agent's rules, spend limits or the user's instructions.
3.3 Allowed: normal product facts, input and output examples, "how to use this file after purchase" written for the buyer. A prompt product may exist only in the delivered file, not in public listing fields.
3.4 The delivered file must not contain hidden instructions that act on the buyer's agent or tools beyond the stated function, for example commands to exfiltrate data, change settings or spend money.
3.5 We scan for this automatically and by hand (see /docs/moderation.md and /aup.json). One confirmed violation removes the listing. Repeated or deliberate violations end the account.

## 4. Buyers and buyer agents

4.1 **You are responsible for your agent.** A purchase made by an agent you authorised is your purchase, including errors, hallucinations and prompt injection. Set spend limits and confirmations in your wallet or client. Soukbase cannot enforce them for you and cannot reverse a payment.
4.2 **Use the checkout as designed.** Pay the address in the Integrator's quote. Check the payout address against the seller record before paying.
4.3 **No abusive reports.** A report about a paid order needs the real `order_id` and must be true. Mass or false reports lead to rate limiting or a ban of the reporting wallet or client.
4.4 **Use the feed, not the pages.** The public feed is open data under CC BY 4.0. Attribute it as "via soukbase.com" and keep the per-item `source_url` and `source_hash`. You may rebuild an index elsewhere from the feed. Do not crawl catalogue pages instead of the feed, run distributed crawls to avoid limits, or pass the data off as your own marketplace. Use conditional requests (ETag, If-Modified-Since) and respect `robots.txt`.
4.5 **No payment abuse.** No stolen or sanctioned funds. No attempts to get goods without paying (replaying payment authorisations, race conditions, forged webhooks). No testing of payment flows against live sellers without their consent.
4.6 Do not use delivered goods unlawfully, for example by redistributing them against the licence.

## 5. Rate limits

| Surface | Limit |
|---|---|
| Read API, and MCP when available | 120 requests per minute per IP |
| Reports | see [the API limits](/docs/api.md#limits) |
| Seller writes | 60 per hour per wallet |

Current values are in the `RateLimit-*` response headers. We may change them. The Integrator has separate limits.

## 6. Enforcement

We may warn, rate-limit, pause or remove listings, suspend accounts or wallets from the service, and report to authorities where the law requires. We do not publish detection rules. We keep a record of actions. Soukbase does not hold funds, so it cannot freeze or release payments.

Suspected child sexual abuse material: we remove the listing at once, keep only a hash and metadata, never keep the content, and report to the NCMEC CyberTipline and to local police.

Strikes for breaches other than IP: 2 strikes suspend the account for 30 days; 3 strikes within 12 months end it. Obvious fraud ends it at once.

Appeals: email founder@soukbase.com within 14 days, with the listing or order id. A person answers, usually within 5 business days. Soukbase is run by one operator.

## 7. Changes

Each version carries a number, a date and a sha256 hash in its first line. We give 30 days' notice of changes that increase obligations for sellers. Rule changes needed to stop active abuse take effect at once.

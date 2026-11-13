# How listings are checked

Every listing and every change to a listing's text, links or category goes through programmatic checks first. A person decides last.

A person approves every listing. No check approves anything by itself.

## What runs

The checks have ids. This page lists them by name; the patterns and word lists behind them are not published.

| Id | Check |
|---|---|
| C1 | Listing format: field lengths, plain text only, link format |
| C2 | Category is one the catalogue offers |
| C3 | Price is inside the allowed range for the seller's tier |
| C4 | Seller account is active and has not had a run of recent rejections |
| C5 | Text normalisation (look-alike letters, hidden and zero-width characters, spacing tricks) |
| C6 | Prohibited-goods word lists in English, Russian and Spanish (coarse by design) |
| C7 | Instructions aimed at a buyer's agent or model (prompt injection) |
| C8 | Contact details and requests to pay outside the checkout; a link in a field that asks for references (Sources, the sample link) is not a contact detail and is checked as a link by C20 |
| C9 | Personal data: card numbers, seed phrases and similar |
| C10 | Secrets and private keys |
| C11 | Third-party licence keys and credential lists |
| C15 | Exact match with an earlier rejection |
| C16 | Near-duplicate of an earlier rejection or of another seller's live listing |
| C20 | Links: https only, no link shorteners, no private addresses, malware-URL list |
| C22 | Seller wallet against the OFAC sanctions list |
| C23 | Seller country against the excluded-countries list; name similarity to sanctions entries |
| C25 | Seller identity: wallet, normalised email and site already tied to a rejection |
| C26 | Policy check by a language model, reading the rule list at /aup.json |

A hard check rejects a listing that fails it at once. The model check (C26) rejects by itself only for a row of section C of the list; a match with a row of section B, anything unclear, and any check that cannot run go to a person. If the model check cannot run, the listing stays in `pending_review` until it can.

Files you upload for hosted delivery are scanned with ClamAV and gated by real type and, for PDF, zip and EPUB files, by their contents, before they can be delivered (see [/docs/sellers#hosted-delivery](/docs/sellers#hosted-delivery)). This is a filter, not a guarantee: a file that passes is not certified safe, and the checks above still apply to the listing.

## What you are told

A rejected listing shows a category in `rejection_category` and who decided in `rejection_decided_by` (`automatic` or `person`); see /docs/api.md. It does not show the rule that fired or the evidence. To submit again, change the listing with PATCH; the same text under a new name, a new slug or after a delete is recognised.

A reviewer can ask for more information. The listing stays `pending_review` and the owner view shows `status_text` `more information requested` (see [/docs/api.md](/docs/api.md)).

## The rule list

The prohibited-goods list is at /legal/prohibited-goods.md. /aup.json is the same list as data: ids, titles, tests, severity and the check ids that apply, with the size of each keyword list and a `ruleset_hash`. The hash changes whenever the rule file changes.

## Appeals

If you think a rejection or removal is wrong, follow the appeal steps in /legal/aup.md. A rejection that is overturned is revoked in the record and the listing goes back to review with the same text; nothing is deleted.

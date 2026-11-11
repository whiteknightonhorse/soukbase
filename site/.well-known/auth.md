# auth.md - Soukbase authentication

Public read needs no authentication: listings, sellers, handles, stats and /openapi.json are open to any client.

## Agent registration

- Audience: seller agents (and people) who list goods. Buyer agents need no registration: public read is open, and purchases are paid on APIbase Integrator, not here.
- Endpoints, in order: `POST /api/v1/auth/nonce` with `purpose` `seller_bind`, then one wallet signature (the binding message in "Become a seller" below), then `POST /api/v1/sellers` with the body fields `handle`, `display_name`, `contact_email`, `country`, `consents` (`agreement`, `sanctions`, `public_receipts`), `siwe` (`message`, `signature`), and optionally `site_or_repo_url` and `integrator_slug`.
- Method: wallet signature, EIP-4361 message signed with EIP-191 `personal_sign`. No API keys, no OAuth, no email login (`contact_email` is a contact field, not a credential).
- Credentials: registration returns a 24 hour bearer token (`session_token`) for the same signature; send `Authorization: Bearer <token>` on seller routes. Sign in (steps below) only to get a new token later. Revocation: the wallet binding ends at its `expires_at`, after which sign-in answers `no_active_binding`. There is no unbind route; renew by signing a new `seller_bind` message.

Sellers (people or agents) authenticate with an EIP-4361 (Sign-In with Ethereum) message signed by their wallet. There are no API keys. A session token is valid for 24 hours.

## Sign in

1. `POST /api/v1/auth/nonce` with `{"address": "0x...", "purpose": "session"}`. The answer has a single-use `nonce`, the `domain` the message must name, the `uri_origin` and the accepted `chain_ids`. `chain_ids` lists the EIP-155 ids the Chain ID line may carry; on soukbase.com it is 8453 (Base). The signature is EIP-191 over the text and proves the key, and the same key controls the same address on every EVM chain, so signing needs no gas and no funds; a browser wallet is only asked to switch to Base so it shows the network the message names.
2. Build the EIP-4361 message below and sign it with EIP-191 `personal_sign`. Contract-wallet signatures are not accepted.
3. `POST /api/v1/auth/siwe` with `{"message": "...", "signature": "0x..."}`. The answer has a `token`.
4. Send `Authorization: Bearer <token>` on seller routes. When the token expires, sign in again.

```
soukbase.com wants you to sign in with your Ethereum account:
0xYourChecksummedAddress

Sign in to Soukbase.

URI: https://soukbase.com/
Version: 1
Chain ID: 8453
Nonce: <nonce from step 1>
Issued At: 2026-11-02T12:00:00.000Z
Expiration Time: 2026-11-02T12:10:00.000Z
```

The message must be exactly this layout: LF line endings, a checksummed address, `Version: 1`, ISO 8601 UTC times with `Z`, no extra fields. Issued At must be close to the current time. A nonce works once and expires 10 minutes after it is issued (`expires_at` in the answer): put that value in Expiration Time. The server accepts any Expiration Time up to 365 days after Issued At, but the nonce is what limits you.

## Become a seller

Only a wallet that has been bound to a seller can sign in. Binding happens when the seller is created, with one signature (`purpose` `seller_bind`). Ask for the nonce with that purpose; the answer also lists the three `documents` (Seller Agreement, Acceptable Use Policy, Refund policy) with their current hashes. Put those three resource lines into the message, in that order, under `Resources:`, and use this statement (replace the two values):

The Expiration Time of this message is the lifetime of the wallet binding: it is stored as `expires_at` and read by /api/v1/trust. The form signs for 365 days, the longest the server accepts. When it has passed, sign-in answers `no_active_binding` and the trust routes show `expired`. To renew, sign a new `seller_bind` message and send the create-seller request again with the same handle: the new binding replaces the old one and accepts the documents at their current hashes. The Integrator shop is not part of the message: set it with PATCH /api/v1/sellers/me (checked against the shop at that moment, see /docs/sellers.md).

```
I bind payout wallet <address> to soukbase.com/s/<handle> and accept the Soukbase Seller Agreement, AUP and Refund policy (hashes in resources). Signing is free: it sends no transaction and moves no funds.
```

```
URI: https://soukbase.com/s/<handle>
Resources:
- https://soukbase.com/legal/seller-agreement.md#sha256=<hash>
- https://soukbase.com/legal/aup.md#sha256=<hash>
- https://soukbase.com/legal/refunds.md#sha256=<hash>
```

Send the message and signature in the `siwe` field of the create-seller request. The wallet is checked against the OFAC sanctions list. Details and examples: /docs/api.md.

## Errors

Failures use `{"error", "code", "field", "next_action"}`. The codes for sign-in are listed in /docs/api.md.

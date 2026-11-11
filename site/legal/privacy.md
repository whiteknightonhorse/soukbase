Version 1.3 - effective 2026-12-12 - sha256 c58a8e7af039334917aa9717eb9d66b95c6638b745c9dc093d270cc766b8eca4

# Soukbase Privacy Policy

This policy says what data Soukbase, operator of soukbase.com ("Soukbase", "we") handles, why, who else sees it, and how long we keep it. Soukbase is not a company: one person, the operator, runs it and is the controller of the personal data described here. Contact for anything in this policy, including requests about your data: founder@soukbase.com. Not legal advice.

## 1. What is public and permanent

Payments run through the APIbase Integrator and produce public receipts that show the payer wallet address, the payout wallet address, the amount, the chain and the transaction hash. Blockchain records are public, and nobody, including us, can delete them. Wallet addresses and transaction hashes that we copy into our events journal are public data in the same way. Do not use a wallet that you do not want linked to your purchases or sales.

## 2. Data we collect

| Data | Why | Kept |
|---|---|---|
| Wallet addresses (seller payout wallet, reporter or payer wallet) | Identify sellers, check sanctions lists, verify reports against receipts | While the account exists and in the events journal (section 4) |
| Signatures and the signed message (EIP-4361): wallet, handle, document hashes, version, time; and, for the Integrator, the shop slug you connect, with the time and the result of the check | Prove that a seller accepted the documents and controls the wallet | While the seller account exists, and for the period the agreement may be disputed |
| Email address | Review replies, notices, reports and disputes | While the account exists |
| Display name (seller form) | Identify the seller on soukbase.com | While the account exists |
| Site or repository URL (seller form, optional) | Check that the seller owns the work | While the account exists |
| Telegram chat id (only if you link a chat for seller notices; nothing else from Telegram is stored) | Send you the same notices that appear on your seller page | Until you unlink: `DELETE /api/v1/sellers/me/telegram` deletes it at once, or ask us (section 5) |
| Country (seller form) | Sanctions and excluded-country checks | While the account exists |
| IP address of requests | Abuse prevention and rate limits | 30 days |
| Listing text and metadata (title, description, price, links, hashes) | Show the listing, review it, serve the feed | While live; rejected text for 30 days, then only a hash skeleton |
| Moderation records (checks, decisions, reasons, strikes) | Run review, appeals and repeat-violation rules | Reports and IP notices 3 years; other records in the events journal |
| Reports and IP notices, with the contact details of the sender | Handle disputes and takedowns | 3 years |
| Files uploaded for hosted delivery, and their delivery ledger (order id, payer wallet address, sha256 of the file and of each copy) | Deliver a personal copy per order, trace a copy that is shared without permission, handle disputes and takedowns | File: until the listing is removed or the file replaced, then 30 days more so paid orders can finish, then erased with its encryption key; ledger: 24 months |
| The marks in each personal copy (order number, payer wallet address, transaction hash; visible and hidden) | Trace a copy that is shared without permission | They stay in the copy the buyer holds; we cannot remove them after delivery |
| Rejected uploads (sha256, type, name, reason; the bytes are deleted at once) | Show you why a file was refused, handle repeat abuse | 90 days |
| Backup of the files service: a copy of its database (ledger and upload records) and of the encrypted files, taken nightly and moved off the server to equipment the operator controls; the encryption key is kept apart from the copy | Restore the service after a failure | An erased file leaves the copy at the next backup; each database copy is deleted after 30 days |
| Backups of the catalogue database (daily copies on the server) | Restore the catalogue after a failure | The newest 14 copies |
| Events journal (order, report, pause, restore, strike, decision, reason code, actor, time) | Append-only record of what happened | Indefinitely; it holds hashes and public wallet addresses only |

We do not collect private keys or seed phrases. We never ask for them. We do not store the keys that sellers deliver. A seller may upload a file for hosted delivery; the files service stores it encrypted, and the catalogue never reads it. The seller form remembers which browser wallet you chose last time in your browser's local storage: one wallet name, no address, never sent to us; clear your browser's site data to forget it.

## 3. Who processes data for us

- **APIbase Integrator** (https://apibase.pro/): runs checkout, delivery and receipts. It has its own privacy terms, and a seller's agreement with it is separate from ours. When you press Connect payments, we send from our server to APIbase your display name, seller page address, handle, country, contact email and wallet address, so that its registration form opens filled in and it can warn you if you sign there with another wallet; none of these values is put in the link, and we keep only the handoff id, its state and the shop slug.
- **Telegram:** the operator receives approval notifications there. They carry listing titles only. If you link a chat for seller notices, our second bot sends the notice sentences to it; Telegram handles them under its own terms.
- **A model provider for moderation:** we send listing text to check it against the rules. We treat the text as data to classify, not as instructions. We do not send account data such as email and wallet address for this.
- **Hosting:** the catalogue and the files service run on servers rented from a hosting provider. The web server logs requests, including IP address, as described above.
- **The seller of an order:** learns the payer wallet of each order from the Integrator. If a marked copy is found shared without permission, we may tell the seller which order it was made for.

We do not sell personal data. The servers and the backup may be in different countries, and your data may be processed outside the country where you live, including outside the European Economic Area and the United Kingdom, in countries without an adequacy decision. We make no promise about a storage region; ask founder@soukbase.com where the data is held today.

## 4. Why we may process it

Running the catalogue, your seller account and your notices: contract. Delivering a hosted file to the buyer of a paid order: the legitimate interest of the seller, the buyer and Soukbase in delivering what was paid for. Marking each personal copy and keeping the delivery ledger for 24 months: the legitimate interest of sellers and Soukbase in deterring and tracing copies shared without permission and in answering disputes, reports and takedown notices; the payment that names the same wallet is public in any case. Preventing fraud, abuse and sanctions breaches, and keeping records: legitimate interest and legal duty. You may object to processing based on legitimate interest (section 5); we cannot remove a mark from a copy already delivered.

## 5. Your rights

Depending on where you live, you may ask to see, correct, delete or export your data, to object to processing, or to withdraw consent. Email founder@soukbase.com. A person answers, usually within 5 business days; one operator runs Soukbase. We cannot delete blockchain data or public Integrator receipts. We may keep what the law requires or what is needed to handle a dispute. You can complain to your local data protection authority.

## 6. Security and incidents

The catalogue holds no Integrator API key, no wallet key and no funds. The files service holds the store's webhook secret (encrypted) and the encryption keys for stored files, and no Integrator API key, wallet key or funds. Stored files are encrypted, each under its own key. This protects a copy of the disk or a backup taken without the key; it does not protect against someone who takes control of the running server. If a breach affects you, we will tell you by email as the law requires.

## 7. Children

Soukbase is not for people under 18, and we do not knowingly collect their data. We handle child sexual abuse material under /legal/aup.md.

## 8. Changes

Each version carries a number, a date and a sha256 hash in its first line. Since version 1.1 a published version is never edited in place: any change of wording gets a new version number. We give 30 days' notice by email for a change that reduces your protection, except where a change is needed at once to follow the law.

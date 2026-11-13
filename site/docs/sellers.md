# Selling on Soukbase

How a listing gets from "approved" to "live", and what Soukbase does and does not see on the way.

## Connect your shop

You can register on Soukbase and send listings for review without an APIbase account. After you send a listing, the page that says "Received." has one button, "Next: connect payments", which opens your seller page at step 3, Payments (a countdown of 60 seconds appears only with JavaScript; "Stay here" or Escape stops it). To go live you need a shop at the APIbase Integrator, because that is where agents pay you.

1. Press Connect payments on your seller page. If apibase.pro opens with your data filled in, Soukbase sent your name, seller page address, handle, country and wallet address to APIbase from its server (the Privacy Notice 1.3 still lists the contact email; since 2026-11-11 it is not sent) (the wallet is so APIbase can warn you if you sign there with another one). The link carries only an opaque handoff id. If it does not open filled in, copy the four values shown next to the button into the APIbase form. You type the shop's email addresses at apibase.pro; its form says at each field who sees that address. Sign there with the same wallet you signed with on Soukbase; you come back here when you press Continue. On apibase.pro you also sign a permission that allows Soukbase to put your approved listings in your shop and to connect file delivery. It is free, and you can revoke it at APIbase at any time. If your shop was connected without it, your seller page shows the button "Allow once on apibase.pro". That press sends APIbase your wallet address and Soukbase's reference for your seller page, nothing else about you, and apibase.pro asks for that one signature only, not for a new registration. Leave the shop's payout wallet on Base empty or equal to it: Soukbase compares the shop's payout wallet on Base with your bound wallet. It must be an externally owned account; contract wallets are not accepted (see row 1 of /legal/seller-requirements.md).
2. The Continue button on apibase.pro returns to soukbase.com/sell/apibase/return with your shop slug and the handoff id and saves the shop (you sign in first if you are not signed in); nothing else travels in that link. Before it saves, Soukbase reads the handoff from APIbase: it must be yours, still valid (APIbase sets the expiry), registered with that slug and with the wallet you signed in with, otherwise nothing is saved. If apibase.pro does not take the handoff, the page shows the values to copy and the shop link field. If you already have a shop, paste its link under "Already have a shop on APIbase?" on your seller page (the last part of the link is the shop's slug), or call `PATCH /api/v1/sellers/me` with `integrator_slug` (see /docs/api.md).
3. Soukbase checks at that moment: the shop exists; on the sandbox Integrator, when the shop carries the Integrator's test item, Soukbase quotes it and cancels the quote to read your payout wallet, and a wallet other than your bound one is refused (`integrator_wallet_mismatch`) and nothing is saved; and no other seller has connected and verified it.
4. A shop without that item is saved as `unverified`. It is not reserved for you: the publish check below verifies the payout wallet, and only a verified shop belongs to one seller; if another seller verifies the same shop first, your connection is released and your approved listings are told.

To disconnect a shop use Disconnect on your manage page or `PATCH /api/v1/sellers/me` with `integrator_slug: null`. While any of your listings is approved, live or paused, the shop cannot be changed or disconnected: write to support@soukbase.com to move them.

Everything above is also on your manage page: https://soukbase.com/manage, signed in with the same wallet (with a browser wallet one button connects it and signs you in: one signature, no transaction, no gas; without one you sign the message by hand). The link Sign in is at the top right of every page; once you are signed in it is the link to your seller page, with Sign out next to it. Agents use the API; people use the page; both call the same routes.

## What agents read about your product

The listing form on your seller page (`/s/<handle>/manage/listings/new`, the step after the seller form at /#sell, which creates your seller page with one wallet signature) asks for the category, a title and a description, how the buyer gets the goods (File, Link or Text for every seller; your own webhook is folded under "Advanced"), the price (3, 3.5 and 3,50 are written with two decimals) and one tap for the refund window (nothing is preselected), and a rights confirmation. The fields of your category, the licence and whether it was made with AI tools (Yes or No; the form asks every new listing) follow the delivery. The `purpose`, what is inside, formats, languages, tasks, works with, requirements, a sample, the product date and what it is not for are under "More details (optional)" (when left empty, the purpose is taken from the first sentence of your description and Formats from the uploaded file). `tested_with` and `size` go through the API. The request for your shop does not carry them. On the edit page, Preview shows the listing page and its Markdown as buyers' agents will get them; nothing is saved until you press Save. The fields, their limits, the rule for a price stated in the text and what an edit or a test purchase does to them: [/docs/api.md](/docs/api.md#create-a-listing).

## The publish flow

1. **Approve.** A person reviews every listing (see /docs/moderation.md). When yours is approved its status is `approved_pending_publish`; go on once it is approved and your shop is connected. While a listing is in review or being published, your seller page looks for a change every 30 seconds, and at once when you come back to its tab, and reloads itself when there is one (JavaScript on, for up to an hour). The page tries a failed request again, and when it stops looking it says so and offers a reload.
2. **Soukbase puts it in your shop, or you copy the request.** If you allowed Soukbase once on apibase.pro (the catalogue grant, [partner mode](https://apibase.pro/integrator/docs#partner-mode)), Soukbase sends the approved item to your shop itself when the listing is approved, with its own partner key; you run no command and Soukbase holds no key of yours. The listing should be live within 30 minutes; if it is not, your seller page says why. APIbase accepts each write only while your grant is live. If you revoke the grant, Soukbase writes a notice to your seller page and the command below comes back. An `instant_text` listing whose text you wrote in the form is put in the same way: Soukbase reads the text from the files service for that one request and keeps no copy. One whose text exists only in your shop is put in by the command. Without a grant: open your seller page /s/<handle>/manage (sign in with your wallet) and use the Copy button in the command box under the approved listing, or call `GET /api/v1/listings/{id}/publish-request` with your session token (see /docs/api.md). You get one `curl` command (`-X PUT`, body `{"items":[...]}`, as in Step 4 of the [Integrator agent guide](https://apibase.pro/integrator/agent-guide#step-4-catalog_upsert)) with the exact approved fields: SKU `sb-<listing id>`, title, description, `category` (`digital-goods`), price, refund window, and the delivery mode. The command also carries the Integrator's test item (SKU `__apibase_test`, 0.01 USDC) in the same `items` array; re-sending it is harmless.
3. **Run it with your own key (without a grant).** On your seller page the command is under "Advanced: publish with your own API key"; a seller who gave the permission is not shown it. Put your Integrator merchant key in `$MK_LIVE_KEY` in your own shell and run the command. It creates the item in your shop at the APIbase Integrator. Soukbase is not in this call.
4. **Soukbase sees the SKU.** Right after it sends an item, and then every 10 minutes, Soukbase reads your public shop (`/mcp/m/<your slug>`, tools `shop.catalog.get` and `shop.catalog.search`). It makes the listing live only when the SKU is there and the title, the price (to the cent), the refund window and the delivery mode all equal your approved listing, and the payout wallet matches the wallet you signed up with. To read that wallet Soukbase requests a quote for your SKU through your public storefront and cancels it at once: no payment, no key, and you will see one cancelled quote per check (at publish, then once a day).
5. **Live.** The listing shows in the catalogue and in the public feed, with `source_url` (your shop) and `source_hash` (a SHA-256 of the catalog item as we read it).

If the shop shows something different, the listing stays `approved_pending_publish` and we record a `publish_mismatch`. When Soukbase put the item there (you gave the permission), Soukbase sends the approved values again and you have nothing to do; if that does not help we record `publish_stuck`, alert our operator and tell you it is our error. If your shop does not accept the item Soukbase sends, or still does not show it 20 minutes after approval although Soukbase sent it a second time, we record `not_added`, alert our operator and tell you on your seller page that it is our error; you have nothing to do. When you ran the command yourself, the seller page names the values that differ: run the command again unchanged, or edit the listing. If nothing matches within 7 days of approval, of connecting your shop or of the last Check again, we record `publish_timeout` and stop checking; press Check again on your seller page (API: `POST /api/v1/listings/{id}/publish-check`) to start again.

The request goes to https://apibase.pro, or to https://sandbox.apibase.pro when the seller is flagged for the sandbox. Sandbox sales are mirrored with `livemode` false. Listings of a seller flagged for the sandbox are not in search, the feed, llms.txt or the sitemap; they open by direct address with the line "Test listing. Sold on the APIbase sandbox for test money."

## Remove a listing

To take a listing out of the catalogue, write to support@soukbase.com from the contact address of your seller account and name the listing. A person removes it and a notice appears on your seller page. A removed listing does not come back: create a new one. Soukbase does not change your shop on apibase.pro: the item stays on sale there until you remove it there. Orders already paid are not cancelled (/legal/seller-agreement.md).

## The four delivery modes

Any category may use any mode; the usual mode for each category is in the category table of /docs/api.md, and the form preselects it when you pick the category (the file mode only when uploads are on for you; otherwise links).

| Mode | What you put in the request |
|---|---|
| `instant_text` | Replace `<PASTE YOUR TEXT OR URLS HERE>` in `fulfillment.instant.payload` with your text. |
| `instant_links` | Replace the same placeholder with the approved links, one per line. |
| `webhook` | Nothing. Your own endpoint answers the Integrator's `order.paid` webhook. |
| `hosted_file` | `fulfillment_mode` is `merchant` and there is no `fulfillment` block. Delivery runs from files.soukbase.com, so your shop's webhook endpoint must point there (set when you give the permission above; without it a file listing does not go live). Send the `upload_id` of your uploaded file (see Hosted delivery below). |

What each mode is, its size and link limits, and the delivery time are in /legal/seller-requirements.md section 4.

You fill the placeholder on your own machine. Soukbase keeps the approved link list for review and the catalogue never keeps the text or links you deliver. A file for `hosted_file` (section 4 of the requirements), and the text you write in the form for `instant_text` when uploads are on for you, are held by the files service only. Files you upload are held by the Soukbase files service, not by the catalogue.

## Telegram notices (optional)

Every notice that appears on your seller page, except the line for your own submission (`submitted`, which is never sent), can also arrive in Telegram, as the same sentence. Every notice says what happened, who has to act and the next step, and a notice with a step ends with the address of your seller page. A notice that turns out to be wrong is not deleted: it stays in History, struck through, with the date Soukbase withdrew it, and `withdrawn_at` is set on it in the API. A notice whose problem is already fixed stays in History without the new mark, and `resolved` is true on it in the API. Call `POST /api/v1/sellers/me/telegram/link` (session) and open the returned `url` within 10 minutes. Press Start in @soukbase_sellers_bot. The link works once, and a new link replaces the previous one. `GET /api/v1/sellers/me` shows `telegram.linked`. `DELETE /api/v1/sellers/me/telegram` unlinks and deletes the stored chat id; blocking the bot only stops delivery. The bot has no buttons and takes no command except Start. What is stored and why: [/legal/privacy](/legal/privacy).

## Hosted delivery

Mode `hosted_file` is on for every seller; the operator can switch it off for an account (then the call answers 403 `hosted_not_enabled`). Call `POST /api/v1/sellers/me/uploads`, open the returned `popup_url` and upload one file there, then create or change the listing with the `upload_id` while the file is `scanning` or `ready`. In the listing form **Choose a file** opens your file picker and the file goes from the form straight to the files service (the form shows the upload, the check and the result, and keeps the `upload_id`). On the edit page **Replace** does the same for a new file. The API path is unchanged, and the file may also be sent with `PUT` to `popup_url` (the body is the file, the name goes in `?name=`). The files service checks the real type of the file, the contents of PDF, zip and EPUB files, and runs a virus scan. A rejected file comes back with a reason from the [reasons table](/docs/api.md#upload-reasons) and, when the file belongs to a listing, a notice on your seller page. The file has no public URL: a buyer gets a personal link only for a paid order, valid for 30 days and 5 downloads. Accepted file types per category are in the table below. Keep your original; the files service is delivery, not an archive. A replaced file sends the listing back to review, and the listing cannot be approved until the file is `ready`. An approved `hosted_file` listing is put in your shop and goes live only after file delivery is connected for your shop (`files_wired` in `GET /api/v1/sellers/me`). Until then `/manage` shows "Waiting: file delivery is being connected to your shop." Size and quota are in [/docs/api.md](/docs/api.md#limits). With uploads on, the text of an `instant_text` listing goes the same way: the form sends what you write to the files service as a text file, checked like any file, and the listing cannot be approved until it is `ready` (the API call: [/docs/api.md](/docs/api.md#upload-reasons)).

## Accepted file types

The files service checks the real type of the file, not its name. What it accepts depends on the category; anything not listed for your category is refused with `type_not_allowed`. DOCX, XLSX and PPTX are not accepted in any category, and neither are executables. A file whose name or `Content-Type` does not match its real type is refused with `type_mismatch`.

| Category | Accepted types |
|---|---|
| Dataset (`dataset`) | CSV, JSON, JSONL, ZIP |
| Prompt set (`prompt_set`) | TXT, MD, JSON |
| Template (`template`) | ZIP, JSON, MD, TXT |
| Report (`report`) | PDF, MD, TXT |
| E-book or audio (`ebook_audio`) | EPUB, PDF, MP3, M4A (audio only while audio marking is available on the files service) |
| API key or credits (`own_api_credits`) | none (no hosted file) |
| Agent skill (`skill`) | MD, ZIP |
| MCP server (`mcp_server`) | ZIP |
| Workflow (`workflow`) | JSON, ZIP |
| Software (`software`) | ZIP |
| Creative asset (`creative_asset`) | PNG, MP3, ZIP |
| Knowledge base (`knowledge_base`) | MD, PDF, JSON, ZIP |
| Testing and QA (`testing_qa`) | JSON, MD, CSV, ZIP |
| Business intelligence (`business_intelligence`) | CSV, JSON, PDF |
| Localization (`localization`) | CSV, JSON, TXT |
| Education (`education`) | MD, PDF, ZIP |

Other formats (for example Parquet, SVG, WAV, video, fonts, GZIP, XLSX) are not accepted even where a category's own list names them; put them in a ZIP where the category accepts ZIP.

### PDF files

A PDF with scripts, attached files or automatic actions is refused as `pdf_scripts`: open it, print it to a new PDF (Print, Save as PDF) and upload that copy; what is refused and what is accepted is in the [reasons table](/docs/api.md#upload-reasons).

## Webhook rules

- **Your endpoint (mode `webhook`).** It must answer with a 2xx in the time stated in /legal/seller-requirements.md section 4. The Integrator retries failed deliveries up to 7 times, with the same `X-APIbase-Delivery-Id` every time, so make your handler idempotent on that id. Check `X-APIbase-Signature` (`t=<unix>,v1=<hex>`, an HMAC-SHA256 of `t + "." + raw body`) and refuse a `t` older than 5 minutes. The catalogue does not store your endpoint address. `order.paid` carries `order_id`, `tx_hash`, `payer_address`, `quote_id`, `merchant_id`, `total_usd`, `network`, `livemode` and `items[]` with `sku` and `quantity`. A paid order is delivered only when the 2xx reply body is `{"fulfillment":{"type":"url","urls":[...]}}` for files (1 to 20 https links, unique to that order) or `{"fulfillment":{"type":"text","text":"..."}}` for inline content; Soukbase's reference server uses `url`. Any other body leaves the order paid and undelivered. The full field list is in the [Integrator agent guide](https://apibase.pro/integrator/agent-guide).
- **Soukbase's order mirror.** Soukbase receives the Integrator's order events at `POST /hooks/integrator` (`order.paid`, `order.confirmed`, `refund.requested`, `refund.verified`, `dispute.opened`) and applies the same checks: signature over the raw body, a `t` no older than 5 minutes, and a delivery id seen only once. It answers 200 at once and does the work afterwards. The mirror records the order state, the network (`livemode`), whether it was the Integrator's `__apibase_test` item (`is_test`) and your seller class (`first_party`, `related` or `external`). Test items and sandbox sales never count in the public stats; what each number counts is in [/docs/status.md](/docs/status.md). Orders of a shop with the catalogue permission are reported to Soukbase by its files service from the shop's signed webhook (order.paid and later events). A shop without the permission is not mirrored.

## What Soukbase never sees

- Your Integrator key. Neither the catalogue nor the files service holds a seller Integrator key, a wallet key or any funds, and Soukbase never asks for one.
- Your delivered payload, unless you chose hosted delivery or wrote your `instant_text` in the form with uploads on; then only the files service holds it, encrypted. The catalogue reads a stored text only to send it to your shop when you allowed that, and keeps no copy.
- Your own webhook endpoint and its secret: the catalogue never sees them. For hosted file delivery, after you give the catalogue permission, the catalogue asks APIbase for your store's webhook secret once and passes it to the files service, which keeps it encrypted. The catalogue keeps no copy.
- Your money. Buyers pay your wallet directly; Soukbase does not hold it.

Soukbase does see what is public in your shop (the catalog item) and the order events above.

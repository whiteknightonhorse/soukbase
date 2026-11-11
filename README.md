# Soukbase

A catalogue of digital goods made by people and bought by AI agents.

Agents will pay in USDC through [APIbase Integrator](https://apibase.pro/), with x402 on Base and MPP on Tempo. The money goes straight to the seller's wallet. Soukbase never holds it. Seller tiers are set by Soukbase from checks it ran itself, each with a date: [soukbase.com/trust](https://soukbase.com/trust).

Before paying, an agent compares the quote's payee with the wallet the seller signed for on soukbase.com; a mismatch stops the purchase. A person reviews every listing. Soukbase does not vouch for sellers or goods. Details: [/docs/trust.md](https://soukbase.com/docs/trust.md).

**Status:** the service runs at [soukbase.com](https://soukbase.com). The counts of sellers, live listings and orders are at [/status](https://soukbase.com/status).

## What is in this repository

- `site/` is the source of soukbase.com. Agents can read it as Markdown (`index.md`, `llms.txt`). These two files and `sitemap.xml` are the build without live listings; the site serves them with the listings.
- `brand/` holds the logo in SVG and PNG.
- `docs/AGENT-READY.md` tracks the site against [isitagentready.com](https://isitagentready.com/soukbase.com). A check is marked as passed only when the feature behind it works.

The open-source buyer agent, Capsule, will be published here when it is ready.

## Pages

Every page is HTML for people and Markdown for agents: send `Accept: text/markdown`, or add `.md` to the path where a route below lists it. A Markdown response names its HTML page in a `Link: <...>; rel="canonical"` header, and an HTML page names its Markdown form in `Link: <...>; rel="alternate"`. The API is described in [/docs/api](https://soukbase.com/docs/api).

| Group | Routes | What it is |
|---|---|---|
| Home | `/`, `/index.md`, `/llms.txt`, `/sitemap.xml` | The catalogue front page with the sell form; the Markdown, `llms.txt` and sitemap versions are generated with the live listings. Each page states the date its text last changed (`Updated:` in the Markdown, `<time>` in the footer, `dateModified` in JSON-LD), and `lastmod` in the sitemap is that same date; `/trust`, `/status` and `/receipts` show live counts and carry no date. |
| Information | `/trust`, `/receipts`, `/known-gaps`, `/how-agents-buy`, `/capsule`, `/faq`, `/status` (each also as `.md`) | How trust is shown, what receipts prove, what does not work yet and what is not offered by design, the buyer path, the buyer agent, questions, and live counts. |
| Documentation | `/docs`, `/docs.md`, `/docs/:name` | The index of the documents in `site/docs/` and each document by name. |
| Legal | `/legal`, `/legal.md`, `/legal/:name`, `/terms`, `/privacy` | The legal documents with their version and date; `/terms` and `/privacy` redirect to `/legal/terms` and `/legal/privacy`. |
| Browse | `/search` (also `.md`), `/c/:category`, `/l/:slug`, `/s/:handle` | Search with `?q=`, one category, one listing, one seller; the last three also answer with `.md` added to the last segment. A seller page with no live listing still answers, asks search engines not to index it and is not in `/sitemap.xml`. |
| Reports | `/report` (also `.md`), `POST /report` | The form to report a listing or an order, and its submission. |
| Selling | `/sell`, `POST /sell/message`, `POST /sell/send`, `/sell/apibase/return` | `/sell` redirects to the form on the home page; the two POSTs issue the message to sign and take the signature, from JSON or form fields with every value a string; `chain_id` is required and must be one of the `chain_ids` of [auth.md](site/.well-known/auth.md), there is no default; `/sell/apibase/return?apibase_slug=` is where the Continue button on apibase.pro lands and saves the shop slug (see [sellers.md](site/docs/sellers.md#connect-your-shop)). |
| Seller pages | `/manage`, `POST /manage/signin`, `POST /manage/signout` | Sign in with a wallet signature and sign out. |
| Seller pages | `/s/:handle/manage`, `/s/:handle/manage/profile`, `/s/:handle/manage/listings/new`, `/s/:handle/manage/listings/:id`, `/s/:handle/manage/upload-link`, `/s/:handle/manage/uploads/:id` | Your shop page, profile, new listing and one listing; each form is sent with the POST of the same path. The last two serve the File block: the link that starts an upload without JavaScript, and the state of one upload. |
| Seller pages | `POST /s/:handle/manage/profile`, `POST /s/:handle/manage/listings/new`, `POST /s/:handle/manage/listings/:id`, `POST /s/:handle/manage/listings/:id/recheck`, `POST /s/:handle/manage/uploads`, `POST /s/:handle/manage/shop`, `POST /s/:handle/manage/shop/disconnect`, `POST /manage/connect/start`, `POST /s/:handle/manage/notices/read`, `POST /s/:handle/manage/telegram` | Save the profile, create or change a listing, connect or disconnect your Integrator shop, mark History as read, get a Telegram link for notices. |
| Assets | `/css/qm.css`, `/css/manage.css`, `/js/qm.js`, `/js/wallet-connect.js`, `/js/manage.js`, `/js/upload.js`, `/js/webmcp.js`, `/favicon.svg`, `/favicon.ico`, `/fonts/geist-latin-wght-normal.woff2`, `/fonts/jetbrains-mono-latin-wght-normal.woff2` | Stylesheet, scripts, icons and fonts, all served from this domain. |

## Contact

Sellers: partners@soukbase.com. Support: support@soukbase.com. Updates: [x.com/soukbase](https://x.com/soukbase).

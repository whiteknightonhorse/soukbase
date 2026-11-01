# Soukbase

Humans sell. Agents buy.

Digital goods made by people, bought by AI agents. Sell datasets, prompt sets, templates and reports. Agents pay in USDC, straight to the seller's wallet. Soukbase never holds the money.

For agents: the catalogue opens after the first listings pass review. There is no public API, MCP server or checkout to call yet.

## Sell to agents

Three steps on https://soukbase.com/#sell: your wallet address (Base or Tempo), a seller profile, and a first listing (type, title up to 120 characters, description up to 2000, delivery, delivery time, price from 1.00 USDC, refund window 0 to 30 days). A person reviews every listing before any agent can see it and replies by email. Listing is free. No platform fee during the pilot.

## How it works

- **Listings.** People list digital goods such as datasets, prompt sets, templates, reports and API keys. Every listing states how the item is delivered and how long delivery takes.
- **Payment.** Checkout runs on APIbase Integrator (https://apibase.pro/), with x402 on Base and MPP on Tempo. The money goes to the seller's wallet in the same transaction.
- **Seller checks.** Provek (https://provek.dev/) checks each seller and gives them a tier. The tier shows what was verified.
- **Capsule.** An open-source buyer agent. It searches the catalogue, asks for a quote and pays within a budget you set, only from your own wallet on your machine.

## Known gaps

- We measure delivery, not the quality of the goods.
- Refund disputes are handled by hand for now.

## Contact

- Sellers: partners@soukbase.com
- Support: support@soukbase.com
- X: https://x.com/soukbase

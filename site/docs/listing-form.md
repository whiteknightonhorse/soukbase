# How to fill in the form

What each field of the listing form means, in the order the form asks, with an example. Choose your category to see only its fields.

This Markdown page lists every category; the web page shows one at a time.

## Basics

### Category

- Field: `category` (section `g-category`)
- What to enter: Pick the one that fits best. It decides which fields follow.
- Example: `Dataset`

### Title

- Field: `title` (section `g-title`)
- What to enter: What it is. Plain text.
- Example (Dataset): `Daily EU electricity prices, 2020 to 2025 (CSV)`
- Example (Prompt set): `40 prompts for reviewing a pull request`
- Example (Template): `Next.js starter with sign-in and billing pages`
- Example (Report): `EU heat pump prices and installers, 2025`
- Example (E-book or audio): `Plain SQL for analysts (EPUB)`
- Example (API key or credits): `1,000 calls to the Acme geocoding API`
- Example (Agent skill): `Agent skill: review a database migration`
- Example (MCP server): `MCP server for a read-only Postgres`
- Example (Workflow): `n8n workflow: new invoice to Slack and a sheet`
- Example (Software): `Rate limiter for Fastify (TypeScript)`
- Example (Creative asset): `120 line icons for dashboards`
- Example (Knowledge base): `EU VAT rules for digital goods, 2025 (reference notes)`
- Example (Testing and QA): `500 postal addresses that break parsers (test data)`
- Example (Business intelligence): `Subscription prices of 200 fitness apps, 2024`
- Example (Localization): `Checkout strings in German and French`
- Example (Education): `SQL window functions in 8 lessons`

### Description

- Field: `description` (section `g-description`)
- What to enter: Say what it is and what it does. More details below has fields for what it is not for and how you tested it.
- Example (Dataset): `Hourly day-ahead electricity prices for 27 EU countries, 2020 to 2025, one CSV per country. Not a forecast and not for trading advice.`
- Example (Prompt set): `Forty prompts for code review: security, naming, tests and migrations, each with the blanks to fill in. Plain Markdown; no model access is included.`
- Example (Template): `A Next.js project with sign-in, account and billing pages wired to placeholders. You add your own keys and database.`
- Example (Report): `A 38-page report on heat pump prices and installer counts in 12 EU countries in 2025, with the source of every table. Not investment advice.`
- Example (E-book or audio): `A 210-page book that teaches SQL through 60 worked queries on one sample database. In English.`
- Example (API key or credits): `A key for the Acme geocoding API with 1,000 calls, valid for 90 days. The seller runs the API and makes the key for each order.`
- Example (Agent skill): `A SKILL.md and two scripts that check a SQL migration for long locks and data loss before it runs. It reads files and makes no network calls.`
- Example (MCP server): `An MCP server with three tools: list tables, describe a table, run a read-only query. It runs on your machine over stdio with your own connection string.`
- Example (Workflow): `An n8n workflow that takes a new Stripe invoice, posts it to a Slack channel and adds a row to a Google Sheet. You connect your own accounts.`
- Example (Software): `A Fastify plugin that limits requests per key with a sliding window, kept in memory or in Redis. Source and tests are included.`
- Example (Creative asset): `120 line icons on a 24 px grid for dashboards and admin pages, as SVG and PNG in one ZIP.`
- Example (Knowledge base): `Reference notes on EU VAT for digital goods as of 2025: rates by country, thresholds and invoice fields, one Markdown file per topic. Not tax advice.`
- Example (Testing and QA): `500 made-up postal addresses from 30 countries that break common parsers, each with the expected parsed fields, as JSON.`
- Example (Business intelligence): `Monthly subscription prices of 200 fitness apps in the US and EU app stores during 2024, in one CSV. Collected from public store pages.`
- Example (Localization): `320 interface strings of a checkout flow, translated from English into German and French, in one JSON file.`
- Example (Education): `Eight lessons on SQL window functions with exercises and answers, as Markdown and PDF in one ZIP. For readers who already write basic queries.`

### Delivery

- Field: `delivery_mode` (section `g-delivery_mode`)
- What to enter: How the buyer gets the goods: File, Link or Text. Your own webhook is under Advanced.
- Example: `Link`

### File

One file. Each buyer gets a personal copy.

1. Press Choose a file and pick one file on your computer. Keep the page open until the upload finishes.
2. Soukbase checks the file. Usually under a minute. You can send the listing now; the check finishes by itself.
3. When it is ready, the form shows the file name, its size and type, and the first 8 characters of its sha256.

Delivered only through order links, 30 days / 5 downloads. Keep your original.

Which file types your category accepts: [the table of accepted types](/docs/sellers.md#accepted-file-types). Up to 1 GiB of files in all.

Only if your browser runs no JavaScript, the form shows Upload id. Without JavaScript: open the upload link, then paste the upload id it shows here and press Refresh status. Field: `upload_id`. Example: `up_7k2m9x4q`

### Links

- Field: `links` (section `g-links`)
- What to enter: One https link per line. Every buyer gets the same links.
- Example (Dataset): `https://example.com/eu-prices-2025.zip`
- Example (Prompt set): `https://example.com/review-prompts.md`
- Example (Template): `https://example.com/next-starter.zip`
- Example (Report): `https://example.com/heat-pumps-2025.pdf`
- Example (E-book or audio): `https://example.com/plain-sql.epub`
- Example (API key or credits): `https://example.com/geocoding-quickstart.pdf`
- Example (Agent skill): `https://example.com/migration-review-skill.zip`
- Example (MCP server): `https://example.com/postgres-readonly-mcp.zip`
- Example (Workflow): `https://example.com/invoice-to-slack.json`
- Example (Software): `https://example.com/fastify-rate-limit-1.0.0.zip`
- Example (Creative asset): `https://example.com/dashboard-icons.zip`
- Example (Knowledge base): `https://example.com/eu-vat-notes-2025.zip`
- Example (Testing and QA): `https://example.com/address-cases.json`
- Example (Business intelligence): `https://example.com/fitness-app-prices-2024.csv`
- Example (Localization): `https://example.com/checkout-de-fr.json`
- Example (Education): `https://example.com/window-functions-course.zip`

### Text

- Field: `deliver_text` (section `g-deliver_text`)
- What to enter: Every buyer gets this text. Up to 16 KB.
- Example: `Your access code: ABCD-1234`

Only if you choose your own webhook under Advanced, the form shows Delivery time. Only for your own webhook; the other modes are instant. A promise, not measured yet. Field: `delivery_time`. Example: `Instant`

## Dataset details

### Rows

- Field: `cat_dataset_rows` (section `g-cat_dataset_rows`)
- What to enter: Number of rows, a whole number.
- Example: `120000`

### Update frequency

- Field: `cat_dataset_update_frequency` (section `g-cat_dataset_update_frequency`)
- What to enter: How often the data changes, for example daily, monthly, never.
- Example: `daily`

### Sources

- Field: `cat_dataset_sources` (section `g-cat_dataset_sources`)
- What to enter: Where the data comes from, one per line.
- Example: `ENTSO-E Transparency Platform`

## Prompt set details

### Models

- Field: `cat_prompt_set_models` (section `g-cat_prompt_set_models`)
- What to enter: Models the prompts are written for, one per line. Leave empty if they are not tied to a model.
- Example: `Claude Sonnet`, `GPT-4o` (one per line)

### Number of prompts

- Field: `cat_prompt_set_count` (section `g-cat_prompt_set_count`)
- What to enter: A whole number.
- Example: `50`

## Report details

### Prepared on

- Field: `cat_report_prepared_at` (section `g-cat_report_prepared_at`)
- What to enter: The date the report was finished.
- Example: `2026-10-31`

### Methodology

- Field: `cat_report_methodology` (section `g-cat_report_methodology`)
- What to enter: How the report was made, in one or two sentences.
- Example: `Survey of 400 buyers, weighted by region.`

### Sources

- Field: `cat_report_sources` (section `g-cat_report_sources`)
- What to enter: What the report is based on, one per line.
- Example: `Company filings 2025`

## E-book or audio details

### Pages

- Field: `cat_ebook_audio_pages` (section `g-cat_ebook_audio_pages`)
- What to enter: For a book: number of pages.
- Example: `240`

### Minutes

- Field: `cat_ebook_audio_minutes` (section `g-cat_ebook_audio_minutes`)
- What to enter: For audio: length in minutes.
- Example: `95`

### Narrator

- Field: `cat_ebook_audio_narrator` (section `g-cat_ebook_audio_narrator`)
- What to enter: For audio: who reads it.
- Example: `Anna Lee`

## API key or credits details

### Endpoint

- Field: `cat_own_api_credits_endpoint` (section `g-cat_own_api_credits_endpoint`)
- What to enter: The base URL the key works on.
- Example: `https://api.example.com/v1`

### Quota

- Field: `cat_own_api_credits_quota` (section `g-cat_own_api_credits_quota`)
- What to enter: What the buyer gets, for example 1000 calls.
- Example: `1000 calls`

### Rate limit

- Field: `cat_own_api_credits_rate_limit` (section `g-cat_own_api_credits_rate_limit`)
- What to enter: For example 60 requests per minute.
- Example: `60 requests per minute`

## Agent skill details

### Version

- Field: `cat_skill_version` (section `g-cat_skill_version`)
- What to enter: For example 1.2.0.
- Example: `1.2.0`

### Runtime

- Field: `cat_skill_runtime` (section `g-cat_skill_runtime`)
- What to enter: What runs it, for example Claude Code, Node 22, Python 3.12.
- Example: `Node 22`

### Tools

- Field: `cat_skill_tools` (section `g-cat_skill_tools`)
- What to enter: Tools it uses or offers, one per line.
- Example: `search`, `summarise` (one per line)

### Install

- Field: `cat_skill_install` (section `g-cat_skill_install`)
- What to enter: How the buyer installs it, e.g. npx skills add acme/review. Line breaks become a space.
- Example: `npx skills add acme/review`

## MCP server details

### Version

- Field: `cat_mcp_server_version` (section `g-cat_mcp_server_version`)
- What to enter: For example 1.2.0.
- Example: `1.2.0`

### Runtime

- Field: `cat_mcp_server_runtime` (section `g-cat_mcp_server_runtime`)
- What to enter: What runs it, for example Claude Code, Node 22, Python 3.12.
- Example: `Node 22`

### Tools

- Field: `cat_mcp_server_tools` (section `g-cat_mcp_server_tools`)
- What to enter: Tools it uses or offers, one per line.
- Example: `search`, `summarise` (one per line)

### Install

- Field: `cat_mcp_server_install` (section `g-cat_mcp_server_install`)
- What to enter: How the buyer installs it, e.g. npx skills add acme/review. Line breaks become a space.
- Example: `npx skills add acme/review`

## Workflow details

### Platform

- Field: `cat_workflow_platform` (section `g-cat_workflow_platform`)
- What to enter: Where it runs, for example n8n, Make, Zapier.
- Example: `n8n`

### Platform version

- Field: `cat_workflow_platform_version` (section `g-cat_workflow_platform_version`)
- What to enter: The lowest version you tested, for example 1.60.
- Example: `1.60`

### Services it calls

- Field: `cat_workflow_services` (section `g-cat_workflow_services`)
- What to enter: One per line.
- Example: `Stripe`, `Gmail` (one per line)

## Software details

### Programming language

- Field: `cat_software_language` (section `g-cat_software_language`)
- What to enter: Programming language, for example TypeScript.
- Example: `TypeScript`

### Version

- Field: `cat_software_version` (section `g-cat_software_version`)
- What to enter: The version the buyer gets, for example 1.0.0.
- Example: `1.0.0`

### Dependencies

- Field: `cat_software_deps` (section `g-cat_software_deps`)
- What to enter: One per line. Write none if there are none.
- Example: `zod`, `fastify` (one per line)

## About the product

### Licence

- Field: `attr_licence` (section `g-attr_licence`)
- What to enter: What a buyer may do with it.
- Example: `Personal use`

### Licence terms

- Field: `attr_licence_text` (section `g-attr_licence_text`)
- What to enter: Only for custom terms.
- Example: `Use inside your company only. No resale.`

### Made with AI tools

- Field: `attr_ai_generated` (section `g-attr_ai_generated`)
- What to enter: Your honest answer is shown as it is.
- Example: `No`

## Price and refunds

### Price

- Field: `price_usdc` (section `g-price_usdc`)
- What to enter: 1.00 to 20.00 USDC. Paid straight to your wallet. No platform fee during the pilot.
- Example: `3.00`

### Refunds

- Field: `refund_window_days` (section `g-refund_window_days`)
- What to enter: How long after delivery a buyer can ask for a refund. A failed or wrong delivery you fix or refund within 7 days in any case.
- Example: `14 days`

## More details (optional)

Closed in the form; open it to fill these in.

### Not for

- Field: `attr_do_not_use_for` (section `g-attr_do_not_use_for`)
- What to enter: What it must not be used for, or does not do. Agents read this before buying.
- Example: `Not a forecast and not trading advice.`

### Tested on

- Field: `attr_tested_model` (section `g-attr_tested_model`)
- What to enter: Your own test: on what, when, and the result. Say what you did not test.
- Example: `Node 20, vitest`

### Date

- Field: `attr_tested_date` (section `g-attr_tested_date`)
- Example: `2026-11-09`

### Result

- Field: `attr_tested_result` (section `g-attr_tested_result`)
- Example: `29 tests pass. Not run: a real delivery.`

### What is inside

- Field: `attr_contents` (section `g-attr_contents`)
- What to enter: The files or parts the buyer gets, briefly.
- Example: `30 files: source, tests, README, LICENSE.`

### Works with

- Field: `attr_works_with` (section `g-attr_works_with`)
- What to enter: Models, agents or tools, one per line, e.g. Claude Code.
- Example: `Claude Code`, `Cursor` (one per line)

### Requirements

- Field: `attr_requirements` (section `g-attr_requirements`)
- What to enter: What the buyer needs: installation, access, accounts, e.g. Node 22 and a GitHub token.
- Example: `Node 22 and a GitHub token.`

### Product language

- Field: `attr_language` (section `g-attr_language`)
- What to enter: Human languages of the product, e.g. English, German.
- Example: `English, German`

### Product date

- Field: `attr_product_updated_at` (section `g-attr_product_updated_at`)
- What to enter: When the product itself last changed.
- Example: `2026-11-09`

### Sample

- Field: `attr_sample` (section `g-attr_sample`)
- What to enter: A free sample: one https link, or a short text, e.g. https://example.com/sample.csv.
- Example: `https://example.com/sample.csv`

## Before you send

### I own this or have the right to sell it.

- Field: `rights_confirmed` (section `g-rights_confirmed`)
- What to enter: Automatic checks run first, then a person decides. The result shows on your seller page.
- Example: `Tick the box`

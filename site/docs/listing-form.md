# How to fill in the form

Every field of the new-listing form, in the order the form asks for it: what to enter and an example. This page is generated from the form's own field definitions, so it cannot differ from the form. Each example is typed into its control when the section scrolls into view (/js/guide.js, styled by /css/guide.css); with reduced motion, or without JavaScript, it is already filled in.

## Basics

### Category

- Field: `category` (section `g-category`)
- What to enter: Pick the one that fits best. It decides which fields follow.
- Example: `Dataset`

### Title

- Field: `title` (section `g-title`)
- What to enter: What it is. Plain text.
- Example: `Daily EU electricity prices, 2020 to 2025 (CSV)`

### Description

- Field: `description` (section `g-description`)
- What to enter: Say what it is, what is inside and what it is not for.
- Example: `Hourly day-ahead electricity prices for 27 EU countries, 2020 to 2025, one CSV per country. Not a forecast and not for trading advice.`

### Delivery

- Field: `delivery_mode` (section `g-delivery_mode`)
- What to enter: How the buyer gets the goods: File, Link or Text. Your own webhook is under Advanced.
- Example: `Link`

### Links

- Field: `links` (section `g-links`)
- What to enter: One https link per line. Every buyer gets the same links.
- Example: `https://example.com/eu-prices-2025.zip`

### Text

- Field: `deliver_text` (section `g-deliver_text`)
- What to enter: Every buyer gets this text. Up to 16 KB.
- Example: `Your access code: ABCD-1234`

### Upload id

- Field: `upload_id` (section `g-upload_id`)
- What to enter: Without JavaScript: open the upload link, then paste the upload id it shows here and press Refresh status.
- Example: `up_7k2m9x4q`

### Delivery time

- Field: `delivery_time` (section `g-delivery_time`)
- What to enter: Only for your own webhook; the other modes are instant. A promise, not measured yet.
- Example: `Instant`

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

## Software details

### Language

- Field: `cat_software_language` (section `g-cat_software_language`)
- What to enter: Programming language, for example TypeScript.
- Example: `TypeScript`

### Dependencies

- Field: `cat_software_deps` (section `g-cat_software_deps`)
- What to enter: One per line.
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
- What to enter: 1.00 to 20.00 USDC.
- Example: `3.00`

### Refunds

- Field: `refund_window_days` (section `g-refund_window_days`)
- What to enter: How long after delivery a buyer can ask for a refund. A failed or wrong delivery you fix or refund within 7 days in any case.
- Example: `14 days`

## More details (optional)

### Languages

- Field: `attr_language` (section `g-attr_language`)
- What to enter: Language codes separated by commas, e.g. en, de.
- Example: `en, de`

### Works with

- Field: `attr_works_with` (section `g-attr_works_with`)
- What to enter: Models, agents or tools, one per line, e.g. Claude Code.
- Example: `Claude Code`, `Cursor` (one per line)

### Requirements

- Field: `attr_requirements` (section `g-attr_requirements`)
- What to enter: What the buyer needs: installation, access, accounts, e.g. Node 22 and a GitHub token.
- Example: `Node 22 and a GitHub token.`

### Sample

- Field: `attr_sample` (section `g-attr_sample`)
- What to enter: A free sample: one https link, or a short text, e.g. https://example.com/sample.csv.
- Example: `https://example.com/sample.csv`

## Before you send

### I own this or have the right to sell it.

- Field: `rights_confirmed` (section `g-rights_confirmed`)
- What to enter: Automatic checks run first, then a person decides. The result shows on your seller page.
- Example: `Tick the box`

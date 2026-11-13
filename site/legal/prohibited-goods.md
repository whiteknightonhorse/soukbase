Version 1.5 - effective 2026-12-12 - sha256 36fc11b6494030284252dcd702c6edb5ad2b000873bcf8e4f472068e46be88dd

# Soukbase Prohibited Goods List

**How to read this list.** (1) Where this list and the Integrator's Acceptable Use Policy (https://apibase.pro/legal/aup.md) differ, the stricter rule applies. (2) If a listing fits two rows, the stricter row applies. (3) A reviewer or classifier answers each test question about the listing text, the delivered item and the seller's links. One "yes" to a section C test blocks the listing. (4) Unclear cases go to `pending_review` and a person decides; Soukbase tells the seller the category, not the rule. Not legal advice.

Delivery is by the Integrator. Soukbase holds goods only as hosted files kept by the files service, never by the catalogue (see /legal/seller-requirements.md section 4).

## A. Allowed in the pilot

These are the types the seller form offers. For each row, every question must be "yes".

| # | Category (form label) | Test |
|---|---|---|
| A1 | Credits for your own API (API key or credits) | Is the service operated by the seller? Does the listing name it and the quantity? Is delivery automatic after payment? |
| A2 | Templates and starter kits (code, config, MCP-server starters, spreadsheets, document templates) | Did the seller author it or hold a licence that allows resale, and is the licence stated? |
| A3 | Reports and research as text or PDF (Report) | Authored by the seller or licensed for resale? Does it avoid every section C row? |
| A4 | Datasets the seller made or compiled, including tables of facts gathered from public sources (Dataset) | Are the rows free of personal data? Is it the seller's own data, or facts the seller gathered and arranged, and not a copy of another party's database, text or media? Does it name its sources? |
| A5 | E-book or audio | Does the seller own the rights? No real person's likeness or voice without consent? No third-party marks? |
| A6 | Own software, scripts, plug-ins, agent skills, configs (every type that ships code: Template, Agent skill, MCP server, Workflow, Software) | Does the seller own the code or does the licence permit distribution? No malware? Licence stated? |
| A7 | Own prompts and prompt packs (Prompt set), original only | Original work, no jailbreak intent, no copyrighted-character or real-person output targets, and delivered only as the delivered file, never in public listing fields? |
| A8 | Agent skills: SKILL.md packages and instruction sets an agent installs (Agent skill) | Does A6 hold? Does every instruction in it serve the task the listing states, with none telling the agent to pay, buy, rate, send data or contact anyone the listing does not name? |
| A9 | MCP servers the seller wrote, delivered as code the buyer runs (MCP server) | Does A6 hold? Does the listing name the tools the server exposes and every outside service it calls? |
| A10 | Workflows and automations: n8n or Make exports, CI pipelines, agent run books (Workflow) | Does A6 hold? Does it name the services and credentials the buyer must bring, and does it ship no credentials of its own? |
| A11 | Software and code components: scripts, libraries, parsers, integrations (Software) | Does A6 hold? Does the listing state the language and what the code does? |
| A12 | Creative assets: icons, UI kits, illustrations, 3D models, textures, sound effects, fonts (Creative asset) | Did the seller make it or hold a licence that allows resale, and does the stated licence say how the buyer may use it? No real person's likeness without consent? |
| A13 | Knowledge bases: handbooks, reference notes and curated documentation for a task (Knowledge base) | Authored by the seller or licensed for resale? Does it name its sources and the date it was last updated? |
| A14 | Testing material: test cases, check suites, synthetic test data (Testing and QA) | Authored by the seller or licensed for resale? Is any test data synthetic or free of personal data? |
| A15 | Business intelligence: supplier lists, price comparisons, market and niche research (Business intelligence) | Are the rows free of personal data, including lead and contact lists (row P6)? Does it name its sources and the date it was prepared? |
| A16 | Language resources: translations, glossaries, term bases (Localization) | Does the seller hold the rights to the source text and to the translation? |
| A17 | Courses and guides that teach a skill (Education) | Authored by the seller or licensed for resale? Does it stay out of finance, trading, law and health (row B5)? |

## B. Restricted: off in the pilot

Soukbase does not accept these categories at launch. Soukbase rejects a listing that fits a B row until it announces the row is on, with a new version of this list.

| # | Category | Status |
|---|---|---|
| B1 | Security research and defensive security content | Off in MVP |
| B2 | Open-source or permissively licensed material resold with added value | Off in MVP |
| B3 | Bulk copies of public sources: scraped pages, posts, reviews, profiles, whole catalogues or price lists, or another party's database | Off in MVP |
| B4 | AI-generated media of real or realistic-looking people | Off in MVP |
| B5 | Educational content on finance, trading, law, health | Off in MVP |
| B6 | Access or credit packs for a third-party service resold by the seller | Off in MVP |
| B7 | Adult-adjacent content such as sex education | Off in MVP |

## C. Prohibited

Each row has a one-line test. A "yes" blocks the listing.

| ID | Category | Test |
|---|---|---|
| P1 | Anything illegal where the seller or buyer is located | Is making, selling, owning or sending this item a crime in the seller's country or in the country of a likely buyer? |
| P2 | Child sexual abuse material and sexualised depictions of minors, real or synthetic | Does it depict, describe or offer sexual content involving a person who is or appears to be under 18? Zero tolerance. See the CSAM line in /legal/aup.md. |
| P3 | Weapons, explosives and dangerous materials: instructions, designs, 3D-print files | Does it give actionable steps or files to make, modify or obtain a weapon, explosive, incendiary, or chemical, biological or radiological agent? |
| P4 | Drugs and analogues, including cultivation, synthesis and sourcing, and harm-reduction material (prohibited in the pilot) | Does it teach or enable making, buying, selling or growing a controlled substance, or is it drug harm-reduction content? |
| P5 | Malware, exploits and hacking tools | Is it code or a guide whose main use is unauthorised access, damage, persistence, evasion, ransomware, botnets, credential theft, phishing kits, DDoS tools or game cheats? |
| P6 | Stolen data, breached or leaked datasets, credential dumps, personal data | Does it contain data obtained without authorisation, or personal data of identifiable people without their consent? Includes lead lists and scraped contact lists. |
| P7 | Third-party API keys, accounts, tokens, logins; resale of subscriptions or licences the seller does not own | Does the buyer receive a key, account, token or seat that belongs to a service the seller does not operate? |
| P8 | Copyrighted or pirated material, counterfeit goods, trademark misuse, cracked software, ripped courses, PLR/MRR packs, unlicensed model weights | Is the seller unable to show they authored it or hold a licence permitting this resale? Is it a copy of another party's paid work? |
| P9 | Gambling, betting tips, prediction services, games for a prize | Does it offer wagering, lotteries, casino services, or guaranteed picks sold for profit? |
| P10 | Securities, investment products, tokens, crypto exchange or wallet services, signals with promised returns, MLM, get-rich-quick | Is it an offer of securities, tokens, yield, copy-trading, a fund or a signals service, or does it promise income? |
| P11 | Medical, legal and financial advice presented as professional advice; pseudo-pharma; supplements with medical claims | Does it give individual diagnosis, treatment, legal or investment advice, or claim to cure a condition? |
| P12 | Impersonation and deepfakes of real people without consent; fake identity or forged documents | Does it imitate a real person's face, voice or signature, or forge an ID, certificate or record? |
| P13 | Adult content and services (prohibited) | Is any content sexually explicit or erotic, or does it sell sexual services or adult memberships? |
| P14 | Hate, extremism, terrorism, violence propaganda, harassment | Does it promote or glorify violence against a group, support a designated terrorist organisation, or exist to harass a named person? |
| P15 | Deceptive goods and practices | Does the description misstate what is delivered, the version, price or author, or invent reviews or statistics? Is the file empty, a placeholder, or different from the listing? |
| P16 | Prompt-injection payloads and instructions aimed at buyer agents | Does any text in the listing, metadata, schema or file names address a model or agent with instructions, such as "ignore previous instructions", "send funds to", hidden text, or an instruction to buy, rate or recommend? |
| P17 | Sanctions-related goods and services | Is the seller, owner or wallet on a sanctions list, or does the item help evade sanctions, export controls or payment screening? |
| P18 | Money laundering, payment circumvention, fake or stolen payment instruments | Does it enable laundering, carding, chargeback fraud, or bypassing a payment system's rules? |
| P19 | Surveillance, stalkerware, doxxing tools | Is it designed to monitor a person without their knowledge, or to expose private information? |
| P20 | Spam, fake engagement, bot farms, account farming, traffic and review trading | Does it sell fake followers, reviews or votes, or automation to evade a platform's rules? |
| P21 | Subscriptions and recurring billing | Does the product renew or bill again? |
| P22 | Physical goods and services needing in-person or manual delivery | Does delivery need a courier, a person or a manual service? |
| P23 | Marketplaces, aggregators, payment intermediaries, gift cards, stored value | Does the seller resell other sellers' goods or take payments for others? |
| P24 | Alcohol, tobacco, vapes, regulated pharmaceuticals | Is the item about selling or obtaining them? |

## D. Enforcement

- Automatic keyword and classifier checks run before a person reviews a listing. We do not publish detailed rules.
- Soukbase removes a listing found in P2, P3, P5, P6 or P17 at once and suspends the seller account pending review.
- A seller may reply within 7 days. /legal/report.md covers reports from buyers' agents.
- Soukbase versions this list. Each version carries its number, date and sha256 hash in the first line.

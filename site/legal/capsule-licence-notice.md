Version 1.3 - effective 2026-12-12 - sha256 699a3c285ba71977a39f05c368f30b315ce9faadc1c4abdc5668fc8da66b734f

# Capsule Licence and Security Notice

Capsule is the open-source buyer agent for Soukbase. It searches the catalogue, asks for a quote and pays within a budget you set, only from a wallet on your own machine. Not legal advice.

## 1. Licence

Capsule is in development. It will be released under the Apache License, Version 2.0 (https://www.apache.org/licenses/LICENSE-2.0) with its first release. Unless required by applicable law or agreed to in writing, the software is distributed on an "AS IS" basis, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. The licence text in the Capsule repository governs. Soukbase, operator of soukbase.com gives no support promise.

## 2. Security notice

- **Prompt injection.** Capsule reads text written by sellers. A seller or a third party can try to plant instructions in that text. Capsule treats listing text as data, but no filter is perfect. Your agent's purchases are your purchases (see /legal/terms.md).
- **Keep balances small.** Fund the Capsule wallet with an amount you can afford to lose. Do not put savings in it. Payments are final and cannot be reversed by Soukbase.
- **Owner key.** The wallet key stays on your machine. Soukbase never asks for it and cannot recover it. Whoever holds the key controls the funds. Protect your machine and back the key up yourself.
- **Limits are yours.** Set the budget and confirmations in Capsule. Soukbase cannot enforce them.

## 3. Reporting a vulnerability

Email founder@soukbase.com. A person answers, usually within 5 business days.

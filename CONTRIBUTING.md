# Contributing Guidelines & Policy

Thank you for your interest in **DECK / divider**!

Please take a moment to review this document to understand our contribution workflow, governance model, and how to effectively report bugs.

---

## 1. Project Governance & Contribution Model

> [!IMPORTANT]
> **DECK / divider is an independent commercial software product governed by a [Strict Proprietary Source-Available License](LICENSE).**
> - **Source-Available**: The codebase is public to foster technical transparency, enable independent security auditing, and allow community defect identification.
> - **External Pull Requests (PRs) Restricted**: Due to commercial licensing, proprietary copyright governance, and the absence of an automated Contributor License Agreement (CLA) pipeline, **unsolicited external Pull Requests will not be merged and will be closed by maintainers**.
> - If you wish to propose substantial architectural enhancements or code contributions, please open an Issue first to discuss potential collaboration under a formal agreement.

---

## 2. Reporting Issues & Bugs

We welcome high-signal bug reports, catalog discrepancy notices, and tournament format legality corrections!

### Before Submitting an Issue
1. **Search Existing Issues**: Check both open and closed issues to ensure the bug has not already been reported or addressed.
2. **Verify on Latest Production**: Check if the defect reproduces on [https://deckdivider.app](https://deckdivider.app).
3. **Isolate Local Factors**: Ensure browser extensions (such as aggressive ad blockers or script disablers) are not interfering with IndexedDB or cryptographic primitives.

### Submitting a High-Quality Bug Report
When filing an issue, please include:
- **Clear Title**: A concise summary of the defect (e.g., `[Bug] Regulation Mark H card incorrectly flagged as rotated in Standard format`).
- **Reproduction Steps**: Exact sequential steps required to reproduce the behavior.
- **Expected vs. Actual Behavior**: What you expected to happen versus what actually occurred.
- **Environment Details**:
  - Operating System (Windows, macOS, Linux, iOS, Android)
  - Browser & Version (Chrome, Firefox, Safari, Edge)
  - Display Currency (USD, EUR, GBP, JPY, etc.)
  - Account Tier (Guest/Starter, Pro, Lifetime)
- **Console Logs & Screenshots**: Browser developer console error traces (redact any sensitive private tokens or emails).

---

## 3. Suggesting Features & Meta Deck Additions

We actively update our championship tournament decklists following major Regional, International, and World Championship events.

If you would like to suggest:
- A new championship archetype or updated 60-card tournament list
- An official Play! Pokémon regulation mark or card errata update
- An improvement to our PSA/BGS/CGC slab valuation calculator

Please open an issue categorized with the `feature-request` or `meta-deck` tag with citations to official Play! Pokémon rules or Limitless TCG event standings.

---

## 4. Code Style & Standards

For maintainers and invited contributors, all code must adhere to:
- **TypeScript**: Strict type checks with zero `any` usage where avoidable. Must pass `npm run lint` (`tsc --noEmit`).
- **Styling**: Tailwind CSS v4 utility classes. No arbitrary CSS modules or inline styling hacks.
- **Testing & Verification**: Must pass `npm run build` and compile cleanly with zero warnings.

---

## 5. Community Code of Conduct

All contributors, issue authors, and community members are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat fellow collectors and developers with respect.

Thank you for helping make DECK / divider the most accurate and reliable Pokémon TCG tool!

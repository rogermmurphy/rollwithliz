# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page static marketing site for **Elizabeth Murphy**, who does business development and full-service factoring at G Squared Funding. The site advertises *her personally* (not the company) to generate new carrier business. Three files, no build step, no backend, no dependencies:

- `index.html` — all page content/structure (nav, hero, services, about, value, success stories, referral, contact, footer, admin modal)
- `styles.css` — all styling
- `script.js` — all behavior (IIFE, vanilla JS, no framework)

## Running / developing

Open `index.html` directly in a browser, or serve the folder (e.g. `python -m http.server`). There is nothing to build, install, or test. Edits are reflected on page reload.

## Lead capture architecture (the one non-obvious part)

Both forms — `#leadForm` (Request a Call) and `#referralForm` (Submit a Referral) — are wired through the same `handleForm()` function in `script.js`. On submit each form does **two things**: saves the submission to `localStorage` under the key `em_leads`, *and* opens a prefilled `mailto:` to `emurphy@gsquaredfunding.com`. There is no server receiving submissions; the mailto is the actual delivery mechanism and localStorage is a local backup/admin record.

- `CONTACT_EMAIL` and `STORAGE_KEY` are constants at the top of `script.js` — update both forms' destination by changing `CONTACT_EMAIL`.
- The **admin lead viewer** is a modal opened by the footer "Leads" button or by loading the page with `#admin` in the URL. It tabulates all stored leads, exports them to CSV, and clears them. Leads live only in the browser that captured them — exporting is the only way to keep a permanent copy.
- Multi-selects (e.g. the "What can I help with?" field) need the explicit handling in `collect()`; a plain `FormData` pass won't capture multiple selected options.

## Conventions

- **Design palette** is derived from Elizabeth's own navy / electric-blue trucking flyers — intentionally NOT the G Squared corporate site. Colors, radii, fonts (Oswald for headings, Inter for body) are CSS custom properties in the `:root` block of `styles.css`; reuse those variables rather than hardcoding values.
- **Headshot:** the About section loads `photo.jpg` from this folder; if absent, `onerror` hides the img and falls back to an "EM" initials / medal treatment. Drop a `photo.jpg` in the root to set her photo.
- The success-story testimonials are realistic **placeholders** — replace with real client quotes when available.

## Key facts baked into the copy

9 years experience; company is 25 years old; 4x "Most Valuable Network" award winner; referral program pays $100 per signed referral. Contact: 678-987-4397, emurphy@gsquaredfunding.com. These appear in multiple places (hero stats, about, footer, structured copy) — update consistently across `index.html` if any change.

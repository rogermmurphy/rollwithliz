# Elizabeth Murphy Carrier Growth Site

A single-page static marketing site for Elizabeth Murphy's carrier support and full-service factoring work. The site is built to help trucking carriers request a call, learn about services, submit referrals, and contact Elizabeth directly.

There is no framework, build step, backend, package manager, or database. Everything lives in plain HTML, CSS, and JavaScript.

## Project Structure

```text
.
+-- index.html    # Page content, forms, modal markup, navigation, and sections
+-- styles.css    # All layout, responsive styles, colors, typography, and UI states
+-- script.js     # Mobile nav, lead/referral handling, local lead viewer, CSV export
+-- CLAUDE.md     # Internal notes for AI coding agents working in this repo
`-- photo.jpg     # Optional headshot image, not currently required
```

## How to Run

Open `index.html` directly in a browser.

For a local web server, run this from the project folder:

```powershell
python -m http.server
```

Then visit:

```text
http://localhost:8000
```

No install command is needed.

## What the Site Includes

- Sticky navigation with mobile menu support
- Hero section with call-to-action links
- Services section for load help, financing, fuel cards, compliance, factoring, and human support
- About section with optional `photo.jpg` headshot support
- Value proposition section
- Placeholder success stories
- Referral program section with a referral form
- Contact section with a lead form
- Footer contact links
- Hidden admin lead viewer with CSV export

## Lead Capture

The project has two forms:

- `#leadForm`: Request a Call
- `#referralForm`: Submit a Referral

Both forms are handled in `script.js` through the shared `handleForm()` function.

When a visitor submits a form, the site:

1. Validates required fields in the browser.
2. Saves the submitted data to `localStorage` under the key `em_leads`.
3. Opens the visitor's email app with a prefilled `mailto:` message to `emurphy@gsquaredfunding.com`.

There is no server-side form processing. The email is the real delivery path, and `localStorage` is only a browser-local backup.

## Admin Lead Viewer

The lead viewer is a modal built into `index.html` and powered by `script.js`.

It can be opened in either of these ways:

- Click the subtle `Leads` button in the footer.
- Load the page with `#admin` at the end of the URL.

Example:

```text
index.html#admin
```

The modal can:

- Show leads stored in the current browser
- Export leads as a CSV file
- Clear all locally stored leads

Important: leads are stored only in the browser that captured them. They are not synced across devices, browsers, or users.

## Common Edits

### Contact Email

Update the `CONTACT_EMAIL` constant in `script.js`:

```js
var CONTACT_EMAIL = "emurphy@gsquaredfunding.com";
```

Also update any visible email links in `index.html`.

### Phone Number

Search `index.html` for:

```text
678-987-4397
6789874397
```

Update both the visible number and the `tel:` links.

### Headshot

Place a file named `photo.jpg` in the project root.

The About section already references it:

```html
<img src="photo.jpg" alt="Elizabeth Murphy" ... />
```

If `photo.jpg` is missing, the page hides the broken image and shows the built-in award medal placeholder instead.

### Success Stories

The current success stories are placeholders. Replace the quotes, names, and roles in the `#stories` section of `index.html` when real client testimonials are available.

### Colors and Typography

Most design tokens are defined as CSS custom properties in the `:root` block of `styles.css`.

Use those variables instead of hardcoding new colors or font stacks:

```css
:root {
  --navy-900: #050d22;
  --blue-500: #1c5fe0;
  --head: "Oswald", "Arial Narrow", "Impact", sans-serif;
  --body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

## Deployment

Because this is a static site, it can be hosted anywhere that serves HTML, CSS, and JavaScript.

Good options include:

- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages
- Any standard web host or cPanel file manager

Deploy the project root so `index.html`, `styles.css`, `script.js`, and optional `photo.jpg` stay in the same folder.

## Browser Storage Notes

The admin lead backup depends on `localStorage`. If a visitor blocks storage, uses private browsing, clears site data, or changes browsers, the local backup may not persist.

The `mailto:` flow should still work even if local storage fails.

## Maintenance Checklist

Before publishing changes:

- Open `index.html` in a browser.
- Test the mobile menu at a narrow screen width.
- Submit a test lead and confirm the email app opens.
- Open `#admin` and confirm the test lead appears.
- Export CSV and verify the columns look correct.
- Clear the test lead from the admin modal.
- Check all phone, email, and Facebook links.
- Review placeholder testimonials before using the site publicly.

## No Build or Test Suite

This project currently has no automated tests. Verification is manual in a browser.

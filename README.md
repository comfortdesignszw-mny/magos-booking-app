# Magos Burgers & Shakes — Ordering PWA

Complete source for the Magos Burgers & Shakes offline-first ordering app.
Millenium Mall, G. Silundika Street, between 5th & 6th Avenue, Bulawayo, Zimbabwe.

**Build:** v1.0.6 (`app.v106.js` / `sw-v106.js`)
**Live:** https://static.teamily.ai/sites/d9c0d58c-572c-418a-8a6a-d33a60de2352/webpages/magos-order-app_v2/index.html

---

## 1. What each file is

| File | Size | Purpose |
|---|---|---|
| `index.html` | 72 KB | The whole page: markup, all CSS in a `<style>` block, inline SVG icon sprite, and the two legal dialogs (Terms of Use, Privacy Policy). No build step, no framework. |
| `app.v106.js` | 41 KB | All behaviour: menu data, cart, localStorage persistence, order dialog, WhatsApp message builder, legal modal controller, service-worker registration. |
| `sw-v106.js` | 4.8 KB | Service worker. Precaches the 11-file shell, serves cache-first, cleans old caches on activate. |
| `manifest.json` | 1.5 KB | PWA manifest — installable, standalone display, 3 icons, 2 shortcuts. |
| `assets/anton-latin.woff2` | 19 KB | Display font (headings, prices). |
| `assets/dmsans-latin.woff2` | 63 KB | Body font. |
| `icons/icon-16.png` | 550 B | Browser tab favicon. |
| `icons/icon-32.png` | 1.1 KB | Favicon, high-DPI tab. |
| `icons/icon-192.png` | 6.6 KB | Android home screen. |
| `icons/icon-512.png` | 19 KB | Splash / store listing. |
| `icons/icon-maskable-512.png` | 14 KB | Android adaptive icon (safe-zone padded). |
| `icons/apple-touch-icon.png` | 6.0 KB | iOS home screen. |

That is **12 files** — every file the app references, and nothing else. There are no
unreferenced leftovers in this package.

---

## 2. Running it locally

The app is fully static — no server-side code, no build step, no dependencies.

```bash
cd magos-order-app
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

Alternatives:

```bash
npx serve .          # Node
php -S localhost:8080  # PHP
```

**Important:** open it over `http://`, not by double-clicking `index.html`.
A `file://` URL cannot register a service worker, so offline mode and the
install prompt will not work. Everything else still functions.

### Confirming the PWA is working

In DevTools → Application:

- **Service Workers** — `sw-v106.js` should show **activated and running**.
- **Cache Storage** — `magos-shell-v1.0.6` should hold **11 entries**.
- **Manifest** — name, icons and `standalone` display should all parse.

Then tick **Offline** in the Network tab and reload: the app should still load
and the cart should still work.

---

## 3. Changing the WhatsApp number

One constant controls where every order goes — `app.v106.js`, line 11:

```js
const MAGOS_WHATSAPP = "263780814597"; // ← single source of truth
```

**Formatting rules — this is where people go wrong:**

- **Digits only.** No `+`, no spaces, no dashes, no brackets.
- **Drop the leading zero** from the local number.
- **Include the country code** (Zimbabwe = `263`).

| Local number | Correct value |
|---|---|
| 078 081 4597 | `263780814597` |
| 073 865 210 | `26373865210` |
| +263 78 081 4597 | `263780814597` |

So to switch the order destination to the second line:

```js
const MAGOS_WHATSAPP = "26373865210";
```

The number is also printed in the footer and in the legal documents as
human-readable text — search `index.html` for `078 081 4597` and `073 865 210`
and update those separately. They are display text, not the order destination.

---

## 4. Editing menu items and prices

All menu content lives in `app.v106.js` in two arrays.

**Categories** (the filter chips), around line 30:

```js
const CATEGORIES = [
  { id: "all",      label: "Everything" },
  { id: "burgers",  label: "Burgers" },
  { id: "shakes",   label: "Milkshakes" },
  { id: "sides",    label: "Chips & sides" },
  { id: "wraps",    label: "Wraps & combos" },
  { id: "platters", label: "Platters" }
];
```

**Items**, starting around line 39:

```js
{ id: "b2", cat: "burgers", name: "Beef Cheeseburger", price: 2.0,
  desc: "Beef patty, a slice of cheese, salad and sauce. The everyday order.",
  tags: ["Beef", "Best seller"], hot: true },
```

| Field | Meaning |
|---|---|
| `id` | **Must be unique.** Used as the cart key and in localStorage — never reuse or change an existing id, or saved carts will break. |
| `cat` | Must match an `id` in `CATEGORIES`. |
| `name` | Shown on the card and in the WhatsApp message. |
| `price` | A **number in USD**, no currency symbol. `2.0` renders as `$2.00`. |
| `desc` | One or two sentences. |
| `tags` | Small pills on the card. Optional. |
| `hot` | `true` adds the "Popular" flag. Optional. |

**To add an item:** copy an existing line, give it a new unique `id`, set the
`cat`, and save. It appears immediately — no rebuild.

**To remove an item:** delete its line. Any cart already holding it will drop
that line on next load.

**To change a price:** edit the `price` number only.

Prices are formatted by a single helper, so `1.5` → `$1.50` everywhere
consistently. Do not put `"$2.00"` in the `price` field — it must stay numeric.

---

## 5. Editing the Terms of Use and Privacy Policy

Both documents are **static HTML inside `index.html`**, not generated by JS.
That is deliberate: they must be readable even if the script fails.

| Document | Location in `index.html` |
|---|---|
| Terms of Use | `<div class="legal" id="legalTerms">` — around line 1107 |
| Privacy Policy | `<div class="legal" id="legalPrivacy">` — around line 1192 |

Each is a `<div class="legal__panel">` containing a header, a scrollable
`<div class="legal__body">` of `<h3>` sections and `<p>` paragraphs, and a
footer with a Close button.

**To edit the text:** change the `<h3>` and `<p>` content directly. Keep the
surrounding structure (`legal__body`, `legal__panel`) intact — the scroll
container and the mobile layout depend on it.

**To add a section:** copy an existing block:

```html
<h3>14. Section heading</h3>
<p>Your paragraph text here.</p>
```

**Do not** change the `id` attributes (`legalTerms`, `legalPrivacy`) — the
open/close logic in `app.v106.js` looks them up by those exact ids via
`LEGAL_IDS` (line 879).

The links that open them are `<a data-legal="terms">` and
`<a data-legal="privacy">`. One delegated listener handles every such link, so
you can add more anywhere on the page and they will work automatically.

> **Note:** these documents were written to accurately describe what this app
> actually does — no server, no customer database, cart stored on the device,
> orders sent through WhatsApp. If you change how the app works (add analytics,
> add a backend, start taking card payments), the Privacy Policy must be
> updated to match, or it becomes inaccurate. Have a Zimbabwean lawyer review
> before launch.

---

## 6. Changing the footer copyright and credit

`index.html`, around line 951:

```html
<strong>&copy;2026 Magos Burger &amp; Shakes. All Rights Reserved</strong>
<div class="foot__credit">Developed with <span class="heart" aria-label="love">&hearts;</span> by Comfort Designs</div>
```

- `&copy;` is the © symbol — leave it as the entity.
- `&amp;` is the ampersand — leave it as the entity inside HTML.
- `&hearts;` is the ♥ in the credit line. It is styled rust-red by the
  `.heart` class; remove the `<span>` if you want plain text.
- The credit line is small and italic via `.foot__credit`.

---

## 7. The versioned-filename rule (important)

**The CDN caches each filename for 30 days. A `?v=` query string will NOT bust
it.** This was confirmed the hard way during development — a changed file kept
being served from cache despite a new query string.

So every change to `app.v106.js` or `sw-v106.js` needs a **new filename**.

### Procedure

1. Copy `app.v106.js` → `app.v107.js`.
2. Make your edits in the new file.
3. Update the `<script src="...">` tag at the bottom of `index.html`.
4. Copy `sw-v106.js` → `sw-v107.js`, and inside it bump:
   ```js
   const VERSION = "v1.0.7";
   ```
   and update the `SHELL` array to list `./app.v107.js`.
5. Update the registration in `app.v107.js`:
   ```js
   navigator.serviceWorker.register("sw-v107.js")
   ```
6. Update `index.html` and `manifest.json` if the icon or font filenames change.

Bumping `VERSION` also changes the cache names (`magos-shell-v1.0.7`), and the
activate handler deletes every `magos-` cache that is not current — so old
caches are cleaned up automatically.

**If you only change `index.html`**, no rename is needed for the JS, but the
service worker will keep serving the cached HTML until `VERSION` is bumped.
Bump it anyway.

---

## 8. Deploying

The app is static — any static host works.

**Cloudflare Pages / Netlify / Vercel**

1. Upload the contents of `magos-order-app/` (not the folder itself) as the
   publish directory.
2. No build command, no output directory transform.
3. Ensure `.woff2` is served as `font/woff2` and `.json` as `application/json`
   (all three hosts do this by default).

**Any Apache/Nginx box**

Drop the folder in the web root. Two things matter:

- **HTTPS is required** for the service worker and install prompt (localhost is
  exempt).
- Serve `sw-v106.js` with `Cache-Control: no-cache` so updates are picked up:

```nginx
location = /sw-v106.js {
  add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

**After deploying**, open the site once, then check DevTools → Application →
Service Workers shows the new version activated. Existing installs update on
the next visit after the browser re-checks the worker (usually within 24 hours,
or immediately on a hard reload).

---

## 9. How the app stores data

Everything is on the customer's own device. There is no server and no database.

| localStorage key | Holds |
|---|---|
| `magos.cart.v1` | The current cart — array of `{id, qty}`. |
| `magos.details.v1` | Last-used name, phone, address, order type, notes. |
| `magos.lastOrder.v1` | A copy of the last sent order, for the "order again" path. |

Clearing site data removes all three. The cart survives a reload, a closed tab
and going offline — that is the offline-first behaviour.

**Orders are not transmitted by the app.** Pressing "Order via WhatsApp" opens
`wa.me` with a pre-filled message; the customer must press send in WhatsApp.
The order only exists once the shop replies to confirm it. This is stated in
the Terms of Use.

---

## 10. Moving to a hosted backend

Not required for the app to work — but if you later want order history,
accounts, or to stop relying on WhatsApp, this is what changes:

1. **Add a server** (Node/Express, PHP, or a serverless function) with a real
   database (PostgreSQL or SQLite). Tables: `orders`, `order_items`, `customers`,
   `menu_items`.
2. **Move the menu out of `app.v106.js`** into the database, served by
   `GET /api/menu`. The `MENU` array becomes a fetch on load, with the current
   array kept as the offline fallback.
3. **Replace the WhatsApp handoff** with `POST /api/orders`. Keep the WhatsApp
   button as a secondary path — many customers prefer it.
4. **Add a write queue for offline orders.** Right now the cart is offline-safe
   but sending is not. Queue the POST in IndexedDB and flush on reconnect, with
   a client-generated UUID so a retry cannot create a duplicate order.
5. **Update the Privacy Policy.** It currently states there is no server and no
   customer database. That becomes false the moment you add one — the document
   must be rewritten to describe what is collected, where it is stored, how long
   it is kept, and who can see it.
6. **Add authentication** for any staff-facing order dashboard, and never expose
   customer phone numbers to an unauthenticated endpoint.

---

## 11. Contact

**Magos Burgers & Shakes**
Millenium Mall, G. Silundika Street, between 5th & 6th Avenue, Bulawayo, Zimbabwe
Phone: 078 081 4597 · 073 865 210

---

*Developed with ♥ by Comfort Designs*

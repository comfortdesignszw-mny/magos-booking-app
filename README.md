# Magos Burgers & Shakes — Order & Book PWA

Complete source code for the offline-first ordering app for **Magos Burgers and Shakes**
(Millenium Mall, G. Silundika Street, Bulawayo, Zimbabwe).

Plain HTML / CSS / JavaScript. **No frameworks, no build step, no dependencies.**
Unzip it, serve the folder over HTTP, and it runs.

---

## What each file is

| File | What it does |
|---|---|
| `index.html` | The whole app shell — markup, embedded CSS, inline SVG icons, and the modal/success screens. This is the page you open. |
| `app.v105.js` | All the app logic: the menu data, cart, search/filter, the order form, the WhatsApp message builder, localStorage persistence, and service-worker registration. **This is the file you edit for menu or number changes.** |
| `sw-v105.js` | The service worker. Pre-caches the app shell on install, serves navigations network-first with a cached fallback, and everything else cache-first. This is what makes the app work offline. |
| `manifest.json` | The PWA manifest — app name, icons, theme colour, `display: standalone`, and two home-screen shortcuts. This is what makes it installable. |
| `icons/` | App icons: `icon-16.png`, `icon-32.png` (favicons), `icon-192.png`, `icon-512.png` (standard), `icon-maskable-512.png` (Android adaptive/maskable), `apple-touch-icon.png` (iOS home screen). |
| `assets/` | The two self-hosted web fonts — `anton-latin.woff2` (headings) and `dmsans-latin.woff2` (body). Self-hosted so the app renders correctly with no internet. |
| `app.js` | **Legacy copy** — an earlier build of the app logic. Not referenced by `index.html`. Kept only for completeness; you can delete it. |
| `service-worker.js` | **Legacy copy** — an earlier service worker (registers `app.v103.js`). Not referenced by `index.html`. Kept only for completeness; you can delete it. |

> The app actually loads `app.v105.js` and registers `sw-v105.js`. The two legacy files
> (`app.js`, `service-worker.js`) are older versions left in the folder — safe to remove.

---

## Running it locally

Service workers **only work over `http://` or `https://`** — opening `index.html` directly
from disk (`file://`) will show the page but the offline caching and install prompt will not work.

Pick any static server. From inside the unzipped folder:

```bash
# Python 3 (already installed on most machines)
python3 -m http.server 8080

# or Node
npx serve .

# or PHP
php -S localhost:8080
```

Then open **http://localhost:8080** in your browser.

To test the offline behaviour: load the page once, then in DevTools → **Application → Service Workers**
tick **Offline**, and reload. The menu should still render.

To test installation: DevTools → **Application → Manifest**, or use the browser's
"Install app" / "Add to Home Screen" option.

---

## Changing the WhatsApp number

The order destination is a **single constant at the very top of `app.v105.js`**:

```js
const MAGOS_WHATSAPP = "263780814597"; // ← single source of truth for the order destination
```

Rules for the value:

- **Digits only** — no `+`, no spaces, no dashes.
- **Full international format** — country code first, without the leading zero of the local number.
- Example: local `078 081 4597` → `263780814597`.

Change that one line and every "Order via WhatsApp" button in the app points at the new number.

---

## Editing menu items and prices

The menu lives in `app.v105.js`, just below the shop details. There are two parts:

**1. Categories** — the filter chips:

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

**2. Items** — one object per menu item:

```js
{ id: "b2", cat: "burgers", name: "Beef Cheeseburger", price: 2.0,
  desc: "Beef patty, a slice of cheese, salad and sauce. The everyday order.",
  tags: ["Beef", "Best seller"], hot: true }
```

| Field | Meaning |
|---|---|
| `id` | Must be **unique**. Used for the cart and for saved orders. |
| `cat` | Must match a `CATEGORIES` `id` (not `all`). |
| `name` | Shown on the card and in the WhatsApp message. |
| `price` | A number in USD, e.g. `2.0` — no `$` sign. |
| `desc` | Short description under the name. |
| `tags` | Small labels on the card, e.g. `["Beef", "Best seller"]`. |
| `hot` | Optional. `true` adds the "popular" highlight. |

**Two-tier prices** (e.g. Chips T-Bone at $3 / $3.50) use a `variants` array instead of a
single `price` — the card then shows a **Regular / Large** selector:

```js
{ id: "s3", cat: "sides", name: "Chips T-Bone", variants: [
    { label: "Regular", price: 3.0 },
    { label: "Large",   price: 3.5 }
  ], desc: "..." }
```

To add an item, copy an existing line, give it a new `id`, and save. To remove one, delete its line.

---

## ⚠️ Important: the CDN caches filenames for 30 days

The hosting CDN caches each **file path** for 30 days. That means if you edit `app.v105.js`
and re-upload it to the *same* filename, returning customers will keep getting the **old
cached copy** — your change will appear to do nothing.

**So every edit needs a new versioned filename.** The convention used here is a version
suffix on the JS files:

1. Rename `app.v105.js` → `app.v106.js` (bump the number).
2. Update the `<script src="...">` tag in `index.html` to point at the new name.
3. Rename `sw-v105.js` → `sw-v106.js`, and inside it update:
   - `const VERSION = "v1.0.6";`
   - the `"./app.v106.js"` entry in the `SHELL` array.
4. Update the `navigator.serviceWorker.register("sw-v106.js")` line in the app JS.
5. Re-upload all changed files.

Bumping the service-worker `VERSION` also makes the old cache get cleaned up automatically
on the next visit.

`index.html` and `manifest.json` are usually safe to overwrite in place, but if a change
doesn't seem to appear, give them a version bump too.

---

## Notes

- The app stores the **cart** and the **last order** in `localStorage`, so both survive a
  reload and work with no connection.
- If the customer is offline when they tap "Order via WhatsApp", the app still builds the
  order and tells them the link will open once they reconnect — the WhatsApp URL is saved
  with the order.
- The WhatsApp number, shop address and hours are all in the `SHOP` object at the top of
  `app.v105.js` if you need to update the shop details.

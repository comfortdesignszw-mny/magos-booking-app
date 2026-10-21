/* ==========================================================================
   MAGOS BURGERS & SHAKES — Order & Book PWA
   Plain JS. No frameworks, no build step.
   ========================================================================== */

/* --------------------------------------------------------------------------
   ██  WHATSAPP NUMBER — CHANGE THIS ONE LINE IF THE SHOP NUMBER CHANGES  ██
   Digits only, full international format, no + and no spaces.
   078 081 4597  ->  263780814597
   -------------------------------------------------------------------------- */
const MAGOS_WHATSAPP = "263780814597"; // ← single source of truth for the order destination

/* --------------------------------------------------------------------------
   Store details (from the shop's Google Maps listing)
   -------------------------------------------------------------------------- */
const SHOP = {
  name: "Magos Burgers and Shakes",
  short: "Magos",
  address: "Millenium Mall, G. Silundika Street, between 5th & 6th Avenue, Bulawayo",
  phone: "078 081 4597",
  phoneAlt: "073 865 210",
  closes: "18:00"
};

/* --------------------------------------------------------------------------
   MENU — items, categories and prices exactly as on the live website
   (magos-burgers-and-shakes.comfort-designszw.workers.dev)
   Two-tier prices are exposed as `variants` (regular / large).
   -------------------------------------------------------------------------- */
const CATEGORIES = [
  { id: "all", label: "Everything" },
  { id: "burgers", label: "Burgers" },
  { id: "shakes", label: "Milkshakes" },
  { id: "sides", label: "Chips & sides" },
  { id: "wraps", label: "Wraps & combos" },
  { id: "platters", label: "Platters" }
];

const MENU = [
  /* ---------------- BURGERS ---------------- */
  { id: "b1", cat: "burgers", name: "Plain Beef Burger", price: 1.5,
    desc: "The simplest thing on the board — a beef patty in a toasted bun.", tags: ["Beef", "Value pick"] },
  { id: "b2", cat: "burgers", name: "Beef Cheeseburger", price: 2.0,
    desc: "Beef patty, a slice of cheese, salad and sauce. The everyday order.", tags: ["Beef", "Best seller"], hot: true },
  { id: "b3", cat: "burgers", name: "Chicken Cheeseburger", price: 3.0,
    desc: "Chicken fillet, cheese, salad and sauce in a soft bun.", tags: ["Chicken"] },
  { id: "b4", cat: "burgers", name: "Magos Beef Cheeseburger", price: 3.0,
    desc: "The house beef cheeseburger — bigger patty, proper cheese, Magos sauce.", tags: ["Signature", "Beef"] },
  { id: "b5", cat: "burgers", name: "Magos Chicken Cheeseburger", price: 3.0,
    desc: "The chicken version of the house burger. Same bun, same sauce, grilled to order.", tags: ["Signature", "Chicken"] },
  { id: "b6", cat: "burgers", name: "Double Beef Cheeseburger", price: 5.0,
    desc: "Two beef patties, double cheese. Comes with a stack of napkins.", tags: ["Double", "Beef"] },
  { id: "b7", cat: "burgers", name: "Double Chicken Cheeseburger", price: 5.0,
    desc: "Two chicken fillets, double cheese, salad and sauce.", tags: ["Double", "Chicken"] },
  { id: "b8", cat: "burgers", name: "Beef & Chicken Cheeseburger", price: 6.0,
    desc: "Can't decide? Both. Beef patty and chicken fillet in one bun with double cheese.", tags: ["Beef & chicken", "Half-and-half"] },
  { id: "b9", cat: "burgers", name: "Magos Baconator", price: 7.0,
    desc: "The top of the burger board: the full stack, with bacon.", tags: ["Bacon", "Loaded"], hot: true },

  /* ---------------- MILKSHAKES ---------------- */
  { id: "s1", cat: "shakes", name: "Regular Milkshake", price: 2.0,
    desc: "Thick, cold and blended to order. Ask which flavours are in the machine today.", tags: ["Shake", "Regular"] },
  { id: "s2", cat: "shakes", name: "Large Milkshake", price: 3.0,
    desc: "The same shake in the big cup — the size most people leave with.", tags: ["Shake", "Large"], hot: true },

  /* ---------------- CHIPS & SIDES ---------------- */
  { id: "c1", cat: "sides", name: "Regular Chips", price: 1.0,
    desc: "One portion, salted. The cheapest way to round off a burger.", tags: ["Chips", "Vegetarian"] },
  { id: "c2", cat: "sides", name: "Large Chips", price: 1.5,
    desc: "The bigger portion — enough to share, or not.", tags: ["Chips", "Shareable"] },
  { id: "c3", cat: "sides", name: "Russian Sausage", price: 2.0,
    desc: "A proper Bulawayo russian, served on its own. Ask for it in a bun.", tags: ["Local favourite"] },
  { id: "c4", cat: "sides", name: "Chips Chicken", price: 3.0,
    desc: "Chips topped with grilled chicken pieces. A full meal for three dollars.", tags: ["Chips", "Chicken"] },
  { id: "c5", cat: "sides", name: "Chips Russian", price: 3.0,
    desc: "Chips with sliced russian sausage — the loaded fries people write about on Google.", tags: ["Chips", "Best seller"], hot: true },
  { id: "c6", cat: "sides", name: "Chips T-Bone", price: 3.0,
    desc: "Chips with T-bone pieces. Regular or large portion.", tags: ["Chips", "T-bone"],
    variants: [{ label: "Regular", price: 3.0 }, { label: "Large", price: 3.5 }] },

  /* ---------------- WRAPS & COMBOS ---------------- */
  { id: "w1", cat: "wraps", name: "Chicken Wrap", price: 3.0,
    desc: "Chicken, salad and sauce rolled in a tortilla. Easier to eat on the move.", tags: ["Wrap", "Chicken"] },
  { id: "w2", cat: "wraps", name: "Shawarma", price: 3.5,
    desc: "Shawarma wrap with meat, salad and a garlicky sauce.", tags: ["Wrap", "Shawarma"] },
  { id: "w3", cat: "wraps", name: "Wrap + Chicken Piece Combo", price: 5.0,
    desc: "A wrap plus a piece of chicken on the side. The five-dollar lunch that fills you.", tags: ["Combo", "1 person"] },

  /* ---------------- PLATTERS ---------------- */
  { id: "p1", cat: "platters", name: "Sadza or Rice & Chicken", price: 2.0,
    desc: "Your choice of sadza or rice with chicken. The cheapest hot plate on the board.", tags: ["Plate", "Chicken"] },
  { id: "p2", cat: "platters", name: "Sadza or Rice & Beef", price: 2.0,
    desc: "Sadza or rice with beef. Simple, filling, and the same price as the chicken plate.", tags: ["Plate", "Beef"] },
  { id: "p3", cat: "platters", name: "Sadza or Rice & T-Bone", price: 2.0,
    desc: "T-bone with sadza or rice. Regular portion $2, large $2.50.", tags: ["Plate", "T-bone"],
    variants: [{ label: "Regular", price: 2.0 }, { label: "Large", price: 2.5 }] },
  { id: "p4", cat: "platters", name: "Sadza or Rice & Meaty Bones", price: 2.0,
    desc: "Meaty bones with sadza or rice — the plate to order for flavour off the bone.", tags: ["Plate", "Meaty bones"] },
  { id: "p5", cat: "platters", name: "Pap, T-Bone, Russian, Chicken & Salad", price: 7.0,
    desc: "The full mixed plate: pap, T-bone, russian, chicken and salad. Built for a serious appetite.", tags: ["Platter", "Mixed"] },
  { id: "p6", cat: "platters", name: "T-Bone, Burger, Chicken & Chips Platter", price: 10.0,
    desc: "Sharing platter: T-bone, a burger, chicken and chips. Enough for two.", tags: ["Platter", "2 people"], hot: true },
  { id: "p7", cat: "platters", name: "T-Bone, Burger, Wrap, Chicken & Chips Platter", price: 12.0,
    desc: "The biggest thing on the board — everything above plus a wrap. Order it for the table.", tags: ["Platter", "Feeds a group"] }
];

const MENU_BY_ID = Object.create(null);
MENU.forEach(function (m) { MENU_BY_ID[m.id] = m; });

/* --------------------------------------------------------------------------
   Storage keys
   -------------------------------------------------------------------------- */
const LS = {
  cart: "magos.cart.v1",
  last: "magos.lastOrder.v1",
  details: "magos.details.v1"
};

/* --------------------------------------------------------------------------
   Small helpers
   -------------------------------------------------------------------------- */
const $  = function (sel, root) { return (root || document).querySelector(sel); };
const $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

function money(n) {
  var v = Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  return "$" + v.toFixed(2);
}
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function readLS(key, fallback) {
  try {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) { return fallback; }
}
function writeLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode */ }
}

var toastTimer = null;
function toast(msg) {
  var el = $("#toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2200);
}

/* --------------------------------------------------------------------------
   State
   -------------------------------------------------------------------------- */
var state = {
  cart: readLS(LS.cart, []),        // [{ key, id, variant, qty }]
  filter: "all",
  query: "",
  pendingOrder: null,               // built order waiting to go to WhatsApp
  lastWaUrl: ""
};

/* Sanitise anything read back from storage */
state.cart = (Array.isArray(state.cart) ? state.cart : []).filter(function (l) {
  return l && MENU_BY_ID[l.id] && Number(l.qty) > 0;
}).map(function (l) {
  return { key: String(l.key || l.id), id: l.id, variant: l.variant == null ? null : String(l.variant), qty: Math.max(1, Math.min(99, parseInt(l.qty, 10) || 1)) };
});

function priceOf(id, variant) {
  var item = MENU_BY_ID[id];
  if (!item) return 0;
  if (item.variants && variant != null) {
    var v = item.variants.find(function (x) { return x.label === variant; });
    if (v) return v.price;
  }
  return item.price;
}
function lineTotal(line) { return priceOf(line.id, line.variant) * line.qty; }
function cartCount() { return state.cart.reduce(function (n, l) { return n + l.qty; }, 0); }
function cartTotal() { return state.cart.reduce(function (n, l) { return n + lineTotal(l); }, 0); }

function cartQtyFor(id) {
  return state.cart.reduce(function (n, l) { return l.id === id ? n + l.qty : n; }, 0);
}

function saveCart() { writeLS(LS.cart, state.cart); }

/* --------------------------------------------------------------------------
   Menu rendering
   -------------------------------------------------------------------------- */
var grid = $("#grid");
var filtersEl = $("#filters");

function renderFilters() {
  var counts = { all: MENU.length };
  MENU.forEach(function (m) { counts[m.cat] = (counts[m.cat] || 0) + 1; });

  filtersEl.innerHTML = CATEGORIES.map(function (c) {
    var n = counts[c.id] || 0;
    return '<button class="chip" type="button" role="button" data-filter="' + c.id + '" aria-pressed="' +
      (state.filter === c.id ? "true" : "false") + '">' + esc(c.label) +
      '<span class="chip__count">' + n + "</span></button>";
  }).join("");
}

function visibleItems() {
  var q = state.query.trim().toLowerCase();
  return MENU.filter(function (m) {
    if (state.filter !== "all" && m.cat !== state.filter) return false;
    if (!q) return true;
    var hay = (m.name + " " + m.desc + " " + m.tags.join(" ")).toLowerCase();
    if (hay.indexOf(q) !== -1) return true;
    // multi-word: every word must appear somewhere
    return q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  });
}

function priceMarkup(item) {
  if (item.variants) {
    return '<div class="dish__price">' + money(item.price) +
      '<small>reg · ' + money(item.variants[1].price) + " lge</small></div>";
  }
  return '<div class="dish__price">' + money(item.price) + "</div>";
}

function footMarkup(item) {
  var inCart = cartQtyFor(item.id);
  var sizeSel = "";
  if (item.variants) {
    sizeSel = '<label class="sr-only" for="sz-' + item.id + '">Portion for ' + esc(item.name) + "</label>" +
      '<select class="size-select" id="sz-' + item.id + '" data-size="' + item.id + '">' +
      item.variants.map(function (v, i) {
        return '<option value="' + esc(v.label) + '"' + (i === 0 ? " selected" : "") + ">" + esc(v.label) + "</option>";
      }).join("") + "</select>";
  }
  return '<div class="dish__foot">' + sizeSel +
    '<button class="btn btn--amber dish__add" type="button" data-add="' + item.id + '">' +
      'Add <span data-addprice="' + item.id + '">' + money(item.price) + "</span></button>" +
    (inCart ? '<span class="in-cart" data-incart="' + item.id + '">×' + inCart + "</span>" : '<span class="in-cart" data-incart="' + item.id + '" hidden></span>') +
    "</div>";
}

function cardMarkup(item) {
  var tags = item.tags.map(function (t) {
    var hot = (t === "Best seller");
    return '<li' + (hot ? ' class="hot"' : "") + ">" + esc(t) + "</li>";
  }).join("");

  return '<article class="dish" data-id="' + item.id + '">' +
    '<div class="dish__top"><h3 class="dish__name">' + esc(item.name) + "</h3>" + priceMarkup(item) + "</div>" +
    '<p class="dish__desc">' + esc(item.desc) + "</p>" +
    '<ul class="dish__tags">' + tags + "</ul>" +
    footMarkup(item) +
    "</article>";
}

function renderMenu() {
  var items = visibleItems();
  grid.innerHTML = items.map(cardMarkup).join("");

  var empty = $("#emptyState");
  if (!items.length) {
    empty.hidden = false;
    grid.innerHTML = "";
    $("#emptyMsg").textContent = state.query
      ? "No match for “" + state.query + "” in " + (state.filter === "all" ? "the menu" : labelOf(state.filter)) + "."
      : "Nothing in this category yet — check back soon.";
  } else {
    empty.hidden = true;
  }

  $("#resultCount").innerHTML = "<strong>" + items.length + "</strong> " + (items.length === 1 ? "item" : "items") +
    (state.filter === "all" ? "" : " in " + esc(labelOf(state.filter).toLowerCase())) +
    (state.query ? ' for “' + esc(state.query) + "”" : "");

  syncCartUI();
}

function labelOf(catId) {
  var c = CATEGORIES.find(function (x) { return x.id === catId; });
  return c ? c.label : catId;
}

/* --------------------------------------------------------------------------
   Cart mutations
   -------------------------------------------------------------------------- */
function addToCart(id, variant) {
  var item = MENU_BY_ID[id];
  if (!item) return;
  var v = item.variants ? (variant || item.variants[0].label) : null;
  var key = v ? id + "|" + v : id;
  var line = state.cart.find(function (l) { return l.key === key; });
  if (line) {
    line.qty = Math.min(99, line.qty + 1);
  } else {
    state.cart.push({ key: key, id: id, variant: v, qty: 1 });
  }
  saveCart();
  syncCartUI();
  toast(item.name + (v ? " (" + v + ")" : "") + " added");
  flashAdded(id);
}

function setLineQty(key, qty) {
  var line = state.cart.find(function (l) { return l.key === key; });
  if (!line) return;
  if (qty <= 0) {
    state.cart = state.cart.filter(function (l) { return l.key !== key; });
  } else {
    line.qty = Math.min(99, qty);
  }
  saveCart();
  syncCartUI();
  renderPanel();
}

function flashAdded(id) {
  var btn = grid.querySelector('[data-add="' + id + '"]');
  if (!btn) return;
  // Toggle a class only — never rebuild the button's innerHTML, or the
  // [data-addprice] span is destroyed and the portion label breaks.
  btn.classList.add("is-added");
  clearTimeout(btn._flashTimer);
  btn._flashTimer = setTimeout(function () {
    btn.classList.remove("is-added");
  }, 1100);
}

/* Update only the bits that depend on the cart — no full re-render, so focus and
   scroll position survive. */
function syncCartUI() {
  var count = cartCount();
  var total = cartTotal();

  // per-card "×N" indicators
  MENU.forEach(function (m) {
    var tag = grid.querySelector('[data-incart="' + m.id + '"]');
    if (!tag) return;
    var n = cartQtyFor(m.id);
    tag.textContent = n ? "×" + n : "";
    tag.hidden = !n;
    var card = tag.closest(".dish");
    if (card) card.classList.toggle("is-in-cart", !!n);
  });

  // mobile cart bar
  var bar = $("#cartbar");
  bar.classList.toggle("show", count > 0);
  $("#cartbarCount").textContent = count;
  $("#cartbarTotal").textContent = money(total);

  // desktop fab + panel
  $("#fab").classList.toggle("show", count > 0);
  $("#fabCount").textContent = count;
  $("#panelTotal").textContent = money(total);
  $("#panelCheckout").disabled = count === 0;

  // header hint
  var hint = $("#cartHint");
  if (hint) {
    hint.innerHTML = count
      ? "<strong>" + count + "</strong> in your order · " + money(total)
      : "Tap <strong>Add</strong> on anything you want";
  }

  // totals inside the modal
  var mt = $("#modalTotal");
  if (mt) mt.textContent = money(total);
  var ft = $("#footTotal");
  if (ft) ft.textContent = money(total);

  renderModalItems();
  if ($("#panel").classList.contains("open")) renderPanel();
}

/* --------------------------------------------------------------------------
   Desktop cart panel
   -------------------------------------------------------------------------- */
function renderPanel() {
  var body = $("#panelBody");
  if (!state.cart.length) {
    var repeat = readLS(LS.last, null);
    body.innerHTML = '<div class="panel__empty">' +
      '<svg aria-hidden="true"><use href="#i-bag"/></svg>' +
      "<p>Your order is empty.</p>" +
      (repeat ? '<button class="btn btn--dark btn--sm" type="button" id="panelRepeat" style="margin-top:12px">Repeat last order</button>' : "") +
      "</div>";
    if (repeat) {
      var rb = $("#panelRepeat");
      if (rb) rb.addEventListener("click", repeatLastOrder);
    }
    return;
  }

  body.innerHTML = '<ul class="cart-list">' + state.cart.map(function (l) {
    var item = MENU_BY_ID[l.id];
    return "<li>" +
      '<div><div class="cart-list__name">' + esc(item.name) + "</div>" +
      '<div class="cart-list__unit">' + money(priceOf(l.id, l.variant)) +
      (l.variant ? " · " + esc(l.variant) : "") + "</div></div>" +
      '<div class="cart-list__right">' +
        '<span class="cart-list__amt">' + money(lineTotal(l)) + "</span>" +
        '<span class="qty">' +
          '<button type="button" data-dec="' + esc(l.key) + '" aria-label="One less ' + esc(item.name) + '">−</button>' +
          "<output>" + l.qty + "</output>" +
          '<button type="button" data-inc="' + esc(l.key) + '" aria-label="One more ' + esc(item.name) + '">+</button>' +
        "</span>" +
        '<button class="cart-list__remove" type="button" data-del="' + esc(l.key) + '">Remove</button>' +
      "</div></li>";
  }).join("") + "</ul>";
}

/* --------------------------------------------------------------------------
   Order modal
   -------------------------------------------------------------------------- */
var modal = $("#modal");
var lastFocused = null;

function openModal() {
  if (!state.cart.length) {
    toast("Add something from the menu first");
    document.getElementById("menu").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  lastFocused = document.activeElement;
  modal.classList.add("open");
  document.body.classList.add("is-locked");
  showFormView();
  prefillForm();
  syncCartUI();
  refreshOfflineUI();
  setTimeout(function () {
    var el = $("#custName");
    if (el) el.focus();
  }, 220);
}

function closeModal() {
  modal.classList.remove("open");
  document.body.classList.remove("is-locked");
  if (lastFocused && lastFocused.focus) lastFocused.focus();
}

function showFormView() {
  $("#formView").style.display = "flex";
  $("#successView").style.display = "none";
}
function showSuccessView() {
  $("#formView").style.display = "none";
  $("#successView").style.display = "block";
}

function renderModalItems() {
  var host = $("#modalItems");
  if (!host) return;
  if (!state.cart.length) {
    host.innerHTML = '<li><span class="li-qty">—</span><span class="li-name">No items yet</span><span class="li-amt"></span></li>';
    return;
  }
  host.innerHTML = state.cart.map(function (l) {
    var item = MENU_BY_ID[l.id];
    return "<li>" +
      '<span class="li-qty">' + l.qty + "×</span>" +
      '<span class="li-name">' + esc(item.name) +
        (l.variant ? "<small>" + esc(l.variant) + "</small>" : "") + "</span>" +
      '<span class="li-amt">' + money(lineTotal(l)) + "</span>" +
      "</li>";
  }).join("");
}

function pad(n) { return String(n).padStart(2, "0"); }

function prefillForm() {
  var d = $("#orderDate");
  var t = $("#orderTime");
  var now = new Date();

  if (!d.value) d.value = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
  d.min = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());

  if (!t.value) {
    // next quarter-hour slot
    var next = new Date(now.getTime() + 30 * 60000);
    next.setMinutes(Math.ceil(next.getMinutes() / 15) * 15, 0, 0);
    t.value = pad(next.getHours()) + ":" + pad(next.getMinutes());
  }

  var saved = readLS(LS.details, null);
  if (saved) {
    if (saved.name && !$("#custName").value) $("#custName").value = saved.name;
    if (saved.phone && !$("#custPhone").value) $("#custPhone").value = saved.phone;
    if (saved.address && !$("#custAddress").value) $("#custAddress").value = saved.address;
  }
}

function currentOrderType() {
  var el = document.querySelector('input[name="type"]:checked');
  return el ? el.value : "Takeaway";
}

function syncAddressField() {
  var isDelivery = currentOrderType() === "Delivery";
  $("#f-address").hidden = !isDelivery;
  $("#custAddress").required = isDelivery;
  if (!isDelivery) clearError($("#f-address"));
  $("#footTotal").closest(".total-row").querySelector("span").textContent =
    isDelivery ? "Items total · delivery fee on confirmation" : "Total";
}

/* ---------------------------- validation ---------------------------- */
function setError(fieldEl) { fieldEl.classList.add("has-error"); }
function clearError(fieldEl) { fieldEl.classList.remove("has-error"); }

function validate() {
  var ok = true;
  var name = $("#custName").value.trim();
  var phone = $("#custPhone").value.trim();
  var digits = phone.replace(/\D/g, "");
  var date = $("#orderDate").value;
  var time = $("#orderTime").value;

  [["#f-name", name.length >= 2],
   ["#f-phone", digits.length >= 9],
   ["#f-date", !!date],
   ["#f-time", !!time]].forEach(function (pair) {
    var el = $(pair[0]);
    if (pair[1]) clearError(el); else { setError(el); ok = false; }
  });

  if (currentOrderType() === "Delivery") {
    var addr = $("#custAddress").value.trim();
    if (addr.length < 6) { setError($("#f-address")); ok = false; }
    else clearError($("#f-address"));
  }

  if (!ok) {
    var firstErr = modal.querySelector(".has-error input, .has-error textarea");
    if (firstErr) firstErr.focus();
  }
  return ok;
}

/* ------------------------- order message builder ------------------------- */
function prettyDate(iso) {
  if (!iso) return "";
  var parts = iso.split("-");
  var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
function prettyTime(t) {
  if (!t) return "";
  var p = t.split(":");
  var h = Number(p[0]), m = Number(p[1]);
  var suffix = h >= 12 ? "pm" : "am";
  var h12 = h % 12 === 0 ? 12 : h % 12;
  return h12 + ":" + pad(m) + " " + suffix;
}

function buildOrder() {
  var name = $("#custName").value.trim();
  var phone = $("#custPhone").value.trim();
  var date = $("#orderDate").value;
  var time = $("#orderTime").value;
  var type = currentOrderType();
  var address = $("#custAddress").value.trim();
  var notes = $("#custNotes").value.trim();
  var ref = "MG-" + Math.random().toString(36).slice(2, 6).toUpperCase();

  var lines = state.cart.map(function (l) {
    var item = MENU_BY_ID[l.id];
    return {
      qty: l.qty,
      name: item.name + (l.variant ? " (" + l.variant + ")" : ""),
      amount: lineTotal(l)
    };
  });

  return {
    ref: ref,
    name: name,
    phone: phone,
    date: date,
    time: time,
    type: type,
    address: address,
    notes: notes,
    lines: lines,
    total: cartTotal(),
    count: cartCount(),
    createdAt: new Date().toISOString()
  };
}

function buildMessage(o) {
  var out = [];
  out.push("*NEW ORDER — Magos Burgers & Shakes*");
  out.push("Ref: " + o.ref);
  out.push("");
  out.push("*Name:* " + o.name);
  out.push("*Phone:* " + o.phone);
  out.push("*Date/Time:* " + prettyDate(o.date) + " at " + prettyTime(o.time));
  out.push("*Order type:* " + o.type);
  if (o.type === "Delivery" && o.address) out.push("*Address:* " + o.address);
  out.push("");
  out.push("*Order (" + o.count + " item" + (o.count === 1 ? "" : "s") + ")*");
  o.lines.forEach(function (l, i) {
    out.push((i + 1) + ". " + l.qty + "× " + l.name + " — " + money(l.amount));
  });
  out.push("");
  out.push("*Total: " + money(o.total) + "*" + (o.type === "Delivery" ? " (excl. delivery fee)" : ""));
  if (o.notes) {
    out.push("");
    out.push("*Notes:* " + o.notes);
  }
  out.push("");
  out.push("Sent from the Magos ordering app.");
  return out.join("\n");
}

function waLink(text) {
  return "https://wa.me/" + MAGOS_WHATSAPP + "?text=" + encodeURIComponent(text);
}

/* ----------------------------- sending ----------------------------- */
function sendOrder() {
  if (!state.cart.length) { toast("Your order is empty"); return; }
  if (!validate()) { toast("Check the highlighted fields"); return; }

  var order = buildOrder();
  var msg = buildMessage(order);
  var url = waLink(msg);

  state.pendingOrder = order;
  state.lastWaUrl = url;

  // Remember details for next time (never leaves the device)
  writeLS(LS.details, { name: order.name, phone: order.phone, address: order.address });

  // Keep the last order so it survives a reload / offline session.
  // The WhatsApp URL is stored too, so an offline order can still be
  // opened the moment the customer reconnects.
  order.waUrl = url;
  writeLS(LS.last, order);

  var online = navigator.onLine !== false;
  if (online) {
    window.open(url, "_blank", "noopener");
  }

  showSuccess(order, online);
}
function hideToast() {
  var el = $("#toast");
  if (!el) return;
  clearTimeout(toastTimer);
  el.classList.remove("show");
}

function showSuccess(order, online) {
  showSuccessView();
  // Clear any "… added" toast so it can never sit over the confirmation.
  hideToast();

  $("#orderRef").textContent = order.ref;

  if (online) {
    $("#successSub").textContent = "Your order has been handed to WhatsApp. Press send in the chat and the shop will confirm the total and timing.";
    $("#reopenWa").innerHTML = 'Reopen WhatsApp <svg aria-hidden="true"><use href="#i-wa"/></svg>';
    $("#reopenWa").classList.remove("btn--amber");
    $("#reopenWa").classList.add("btn--dark");
  } else {
    $("#successSub").textContent = "You're offline, so WhatsApp couldn't open yet. Your order is saved on this device — it will open the moment you reconnect.";
    $("#reopenWa").innerHTML = 'Open WhatsApp <svg aria-hidden="true"><use href="#i-wa"/></svg>';
    $("#reopenWa").classList.remove("btn--dark");
    $("#reopenWa").classList.add("btn--amber");
  }

  $("#successSummary").innerHTML =
    '<div class="summary__head"><span>' + esc(order.name) + " · " + esc(order.type) + "</span><span>" +
      esc(prettyDate(order.date)) + "</span></div>" +
    "<ul>" + order.lines.map(function (l) {
      return '<li><span class="li-qty">' + l.qty + "×</span>" +
        '<span class="li-name">' + esc(l.name) + "</span>" +
        '<span class="li-amt">' + money(l.amount) + "</span></li>";
    }).join("") + "</ul>" +
    '<div class="summary__total"><span>Total</span><strong>' + money(order.total) + "</strong></div>";
}

function resetOrder() {
  state.cart = [];
  saveCart();
  syncCartUI();
  renderPanel();

  // clear the form for the next order but keep name / phone
  $("#custNotes").value = "";
  $("#custAddress").value = "";
  $$("#orderForm .field").forEach(clearError);

  showFormView();
  closeModal();
  document.getElementById("menu").scrollIntoView({ behavior: "smooth", block: "start" });
  toast("Order cleared — add your next items");
}

function repeatLastOrder() {
  var last = readLS(LS.last, null);
  if (!last || !Array.isArray(last.lines) || !last.lines.length) {
    toast("No previous order on this device");
    return;
  }

  // Rebuild the cart from the last order (match by name, variant included)
  var rebuilt = [];
  last.lines.forEach(function (l) {
    var base = l.name.replace(/\s*\([^)]*\)\s*$/, "");
    var variant = (l.name.match(/\(([^)]*)\)\s*$/) || [])[1] || null;
    var item = MENU.find(function (m) { return m.name === base; });
    if (!item) return;
    var v = item.variants ? (variant || item.variants[0].label) : null;
    rebuilt.push({ key: v ? item.id + "|" + v : item.id, id: item.id, variant: v, qty: l.qty });
  });

  if (!rebuilt.length) { toast("That order can't be rebuilt — items may have changed"); return; }

  state.cart = rebuilt;
  saveCart();
  renderMenu();
  renderPanel();
  toast("Last order restored");
  openModal();
}

/* --------------------------------------------------------------------------
   Offline awareness
   -------------------------------------------------------------------------- */
function refreshOfflineUI() {
  var offline = navigator.onLine === false;
  $("#offlineBanner").classList.toggle("show", offline);
  $("#modalOffline").classList.toggle("show", offline);
  var st = $("#openState");
  if (st) st.textContent = offline ? "Offline · menu still available" : "Open today · order on WhatsApp";
}

window.addEventListener("online", function () {
  refreshOfflineUI();
  toast("Back online — tap Open WhatsApp to send your order");
});
window.addEventListener("offline", function () {
  refreshOfflineUI();
  toast("You're offline — you can still build an order");
});

/* --------------------------------------------------------------------------
   Search + filters
   -------------------------------------------------------------------------- */
var searchInput = $("#q");

searchInput.addEventListener("input", function () {
  state.query = searchInput.value;
  $("#searchWrap").classList.toggle("has-value", !!state.query);
  renderMenu();
});

$("#clearQ").addEventListener("click", function () {
  searchInput.value = "";
  state.query = "";
  $("#searchWrap").classList.remove("has-value");
  renderMenu();
  searchInput.focus();
});

filtersEl.addEventListener("click", function (e) {
  var btn = e.target.closest("[data-filter]");
  if (!btn) return;
  state.filter = btn.getAttribute("data-filter");
  $$(".chip", filtersEl).forEach(function (c) {
    c.setAttribute("aria-pressed", c === btn ? "true" : "false");
  });
  renderMenu();
});

/* Add buttons + size selects (delegated, survives re-render) */
grid.addEventListener("change", function (e) {
  var sel = e.target.closest("[data-size]");
  if (!sel) return;
  var id = sel.getAttribute("data-size");
  var item = MENU_BY_ID[id];
  var priceEl = grid.querySelector('[data-addprice="' + id + '"]');
  if (priceEl && item) {
    var v = item.variants.find(function (x) { return x.label === sel.value; });
    priceEl.textContent = money(v ? v.price : item.price);
  }
});

grid.addEventListener("click", function (e) {
  var btn = e.target.closest("[data-add]");
  if (!btn) return;
  var id = btn.getAttribute("data-add");
  var sel = grid.querySelector('[data-size="' + id + '"]');
  addToCart(id, sel ? sel.value : null);
});

/* --------------------------------------------------------------------------
   Cart panel wiring
   -------------------------------------------------------------------------- */
function openPanel() {
  $("#panel").classList.add("open");
  $("#panel").setAttribute("aria-hidden", "false");
  renderPanel();
}
function closePanel() {
  $("#panel").classList.remove("open");
  $("#panel").setAttribute("aria-hidden", "true");
}

$("#fab").addEventListener("click", openPanel);
$("#panelClose").addEventListener("click", closePanel);
$("#cartbarBtn").addEventListener("click", openModal);
$("#panelCheckout").addEventListener("click", function () {
  closePanel();
  openModal();
});

$("#panelBody").addEventListener("click", function (e) {
  var inc = e.target.closest("[data-inc]");
  var dec = e.target.closest("[data-dec]");
  var del = e.target.closest("[data-del]");
  if (inc) {
    var l1 = state.cart.find(function (l) { return l.key === inc.getAttribute("data-inc"); });
    if (l1) setLineQty(l1.key, l1.qty + 1);
  } else if (dec) {
    var l2 = state.cart.find(function (l) { return l.key === dec.getAttribute("data-dec"); });
    if (l2) setLineQty(l2.key, l2.qty - 1);
  } else if (del) {
    setLineQty(del.getAttribute("data-del"), 0);
    toast("Removed from order");
  }
});

/* --------------------------------------------------------------------------
   Modal wiring
   -------------------------------------------------------------------------- */
$$("[data-close]").forEach(function (el) { el.addEventListener("click", closeModal); });

document.addEventListener("keydown", function (e) {
  if (e.key !== "Escape") return;
  if (modal.classList.contains("open")) closeModal();
  else if ($("#panel").classList.contains("open")) closePanel();
});

$$('input[name="type"]').forEach(function (r) {
  r.addEventListener("change", syncAddressField);
});

$("#orderForm").addEventListener("submit", function (e) { e.preventDefault(); });
$("#orderForm").addEventListener("input", function (e) {
  var field = e.target.closest(".field");
  if (field) clearError(field);
});

$("#sendBtn").addEventListener("click", sendOrder);

$("#editItems").addEventListener("click", function () {
  closeModal();
  document.getElementById("menu").scrollIntoView({ behavior: "smooth", block: "start" });
  toast("Change your items, then tap View order");
});

$("#againBtn").addEventListener("click", resetOrder);

$("#reopenWa").addEventListener("click", function () {
  if (navigator.onLine === false) {
    toast("Still offline — will open once you reconnect");
    return;
  }
  if (state.lastWaUrl) window.open(state.lastWaUrl, "_blank", "noopener");
  else toast("No order to reopen");
});

$("#startOrder").addEventListener("click", function () {
  if (state.cart.length) openModal();
  else {
    document.getElementById("menu").scrollIntoView({ behavior: "smooth", block: "start" });
    toast("Tap Add on anything you want");
  }
});

$("#comboBtn").addEventListener("click", function () {
  state.filter = "platters";
  state.query = "";
  searchInput.value = "";
  $("#searchWrap").classList.remove("has-value");
  renderFilters();
  renderMenu();
  document.getElementById("menu").scrollIntoView({ behavior: "smooth", block: "start" });
});

/* sticky search shadow */
var tools = $("#tools");
if ("IntersectionObserver" in window && tools) {
  var sentinel = document.createElement("div");
  tools.parentNode.insertBefore(sentinel, tools);
  new IntersectionObserver(function (entries) {
    tools.classList.toggle("is-stuck", !entries[0].isIntersecting);
  }, { rootMargin: "-64px 0px 0px 0px" }).observe(sentinel);
}

/* --------------------------------------------------------------------------
   Install prompt
   -------------------------------------------------------------------------- */
var deferredPrompt = null;
window.addEventListener("beforeinstallprompt", function (e) {
  e.preventDefault();
  deferredPrompt = e;
  $("#installBar").classList.add("show");
});
$("#installBtn").addEventListener("click", function () {
  if (!deferredPrompt) {
    toast("Use your browser menu → Add to Home Screen");
    return;
  }
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(function () {
    deferredPrompt = null;
    $("#installBar").classList.remove("show");
  });
});
window.addEventListener("appinstalled", function () {
  $("#installBar").classList.remove("show");
  toast("Magos installed — open it from your home screen");
});

/* --------------------------------------------------------------------------
   Service worker
   -------------------------------------------------------------------------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    // Versioned filename: the CDN caches each file path for 30 days, so a new
    // service worker must live at a NEW path or browsers would never see it.
    navigator.serviceWorker.register("sw-v105.js").then(function (reg) {
      document.documentElement.setAttribute("data-sw", "registered");
      // If an update lands while the app is open, offer a refresh.
      reg.addEventListener("updatefound", function () {
        var nw = reg.installing;
        if (!nw) return;
        nw.addEventListener("statechange", function () {
          if (nw.state === "installed" && navigator.serviceWorker.controller) {
            toast("New menu update ready — close and reopen the app");
          }
        });
      });
    }).catch(function (err) {
      console.warn("Service worker registration failed:", err);
    });
  });
}

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */
/* An order placed while offline is stored with its WhatsApp link, so the
   "Open WhatsApp" button works the moment the phone reconnects. */
(function restorePendingLink() {
  var last = readLS(LS.last, null);
  if (last && last.waUrl) state.lastWaUrl = last.waUrl;
})();

renderFilters();
renderMenu();
renderPanel();
syncAddressField();
refreshOfflineUI();
prefillForm();

/* "Repeat last order" entry point appears only if we have one */
(function () {
  var last = readLS(LS.last, null);
  if (!last) return;
  var host = $("#startOrder");
  if (!host || !host.parentNode) return;
  var b = document.createElement("button");
  b.type = "button";
  b.className = "btn btn--amber btn--sm";
  b.id = "repeatBtn";
  b.innerHTML = "Repeat last order";
  b.addEventListener("click", repeatLastOrder);
  host.parentNode.insertBefore(b, host);
})();

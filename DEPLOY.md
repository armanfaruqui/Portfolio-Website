# Deploying the Désiré child theme to live (desire.jewelry)

Everything you need to make the live site match localhost. Read once end‑to‑end
before starting.

---

## 0. What this deploy consists of

**A) The child theme** — `blocksy-child.zip` (72 KB, in this folder).
This carries ALL the design + behavior work:
- Product page: layout rhythm, materials spec, price styling, colorway row,
  A24-style variant swatches (Chain Length / Size), Buy Now, hover image-flip.
- Checkout: streamlined fields, two-column rows, on-brand styling, express
  (Apple Pay / Google Pay) prominence.
- Cart "return to shop" → homepage.
- The Ssense font (woff2).

**B) Database changes** — these are NOT in the theme. I already applied all
three directly to the LIVE site, so there is nothing for you to do here:
1. Product-page layer order (materials before price) — in the live Customizer.
2. Veevee Yuzu description `<pre>` fix — product #222.
3. Veevee Wasabi default chain length = 18" — product #102.

**C) Local-only file you must NOT copy up:**
`wp-content/mu-plugins/desire-local-sync.php` — this is local scaffolding only.
It is NOT in the zip and must never go to live.

---

## 1. Back up live first (2 min, do not skip)

WordPress admin → **WPvivid Backup** → **Backup Now** (full site: DB + files).
Wait for it to finish. This is your instant undo if anything looks wrong.

---

## 2. Upload & activate the theme

1. WordPress admin → **Appearance → Themes → Add New → Upload Theme**.
2. Choose `blocksy-child.zip` → **Install Now**.
3. When it finishes, click **Activate**.

> If the host rejects the upload for any reason, use SFTP / the host file
> manager instead: unzip locally and upload the `blocksy-child` folder into
> `wp-content/themes/`, then activate under Appearance → Themes. (At 72 KB the
> zip upload should just work.)

---

## 3. What activation does automatically (the important part)

WordPress stores every Customizer setting **per theme**. A child theme normally
starts blank — which would wipe your header, logo, colors, footer, and the
product-layout order the moment you activate it.

**This theme prevents that.** On first activation it copies all Customizer
settings from the parent (`blocksy`) to the child (`blocksy-child`) — including
your header/logo/footer, colors, the Additional CSS reference, and the
product-page layer order. So the site keeps its exact look and gains the new
work.

- You do **not** need to touch the Customizer.
- If the site looks momentarily unstyled right after activating, load the
  homepage once — the copy runs on that first request.
- Edge case: if `blocksy-child` was ever activated on live before, its settings
  may be stale. Tell me and I'll confirm before you activate.

---

## 4. Clear caches

After activating, clear any caching so visitors get the new CSS/JS:
- Host/CDN cache (Porkbun panel / Cloudflare if used).
- Any WP cache plugin.
- Your own browser: hard refresh (Ctrl+Shift+R).

---

## 5. Verify on live (walk this checklist)

**Product page** (e.g. /product/veevee-wasabi/)
- [ ] Order reads: title → materials → price → COLORWAY → CHAIN LENGTH →
      Buy Now / Add to Cart → description.
- [ ] COLORWAY row: Wasabi/Mochi/Yuzu, selected one in its brand color, others
      grey; clicking a grey one loads that product.
- [ ] CHAIN LENGTH / SIZE swatches select correctly; price stays single/correct.
- [ ] Buy Now → jumps straight to checkout. Add to Cart → adds without leaving.
- [ ] Hovering the main image flips to the 2nd gallery image.
- [ ] No stray colorway rows down by the related products.

**Simple + sale product** (/product/ondule-earrings-silver/)
- [ ] Strike-through original + sale price render cleanly; no variant row.

**Top bar** (product/cart): HOME · CAD/USD · CART(n), currency toggle switches.

**Checkout** (add an item first)
- [ ] Apple Pay / Google Pay appear at the top (THIS is the live-only payoff —
      it never showed locally because Stripe needs HTTPS + the verified domain).
- [ ] Form is compact: email first, no company/notes, paired rows, one address.
- [ ] "Ship to a different address" is unchecked by default.
- [ ] Place a small real test order (or Stripe test mode) to confirm payment
      end-to-end.

**Cart**: "Return to shop" / empty-cart button → homepage (not /shop).

**Homepage + everything else**: unchanged (all work is scoped to
product/cart/checkout).

---

## 6. Rollback (if needed)

Appearance → Themes → activate **Blocksy** (the parent) again. The child's
settings are stored separately, so reverting is clean and instant. The three
DB fixes (layer order, Yuzu, Wasabi default) are harmless and can stay. For a
deeper revert, restore the WPvivid backup from step 1.

---

## 7. Optional follow-ups (not required for parity)

- **Checkout banner**: add it on live in the page editor (Checkout page → after
  the `[woocommerce_checkout]` block → Image block). Do it on live, not local —
  page content doesn't travel with the theme zip.
- **Dead CSS cleanup**: the old `.woocommerce-Tabs-panel--description p` rule in
  your Additional CSS / Custom CSS Pro is now unused (that description moved into
  the product column). Safe to delete when convenient.
- **Harden the parent tweaks**: the sale-price / add-to-cart-text / shop-hover
  code currently lives in the *parent* Blocksy `functions.php` and a Blocksy
  update would wipe it. Worth moving into the child theme later — ask me and I'll
  migrate it.

# Portfolio — working context

Handoff notes. Written 2026-07-25.

---

## 0. Where things live (IMPORTANT — this moved)

Everything now lives in **`C:\Users\arman\OneDrive\Documents\Portfolio\ProductPortfolio\`**.

At ~16:44 on 2026-07-25 the contents of `Portfolio\2026\` were moved here. Nothing was
lost. `Portfolio\2026\` is now **empty**. `Portfolio\New folder\` is empty.
`Portfolio\backup\` is the *older* site (fonts/, images/, zine/) — unrelated.

```
ProductPortfolio\
├── index.html          ← the entire site (~29 KB, self-contained)
├── CONTEXT.md          ← this file
├── media\              ← 22 files
├── .claude\  .git\
├── DEPLOY.md           ← belongs to the desire.jewelry WordPress site, not this one
└── blocksy-child.zip   ← same, WordPress child theme
```

Note: a Claude session may still have `2026\` as its cwd. Point work at `ProductPortfolio\`.

---

## 1. What the site is

Single self-contained `index.html` — CSS + HTML + vanilla JS, no dependencies, no build step.
A cursor-driven 3D parallax carousel.

`html, body { overflow: hidden }` — there is no scrollbar. **Cursor X position is the scroll.**
Cards form an infinite ring in a `perspective: 1200px` stage; every frame recomputes each
card's `translate3d + rotateX/Y/Z`.

Four inputs, one `scrollU` float (in "card units", wrapped by `ringOffset()`):

| Input | Behavior |
|---|---|
| Cursor X | `driftSpeed()` — dead zone ±18vw, `t^2.2` ramp to 0.72 cards/sec, 0.35s inertia |
| Cursor X+Y | Scene tilt, pitch ±21° / yaw ±26°, 0.07s tau (tracks live) |
| Arrow keys | Snap to integer index, 0.11s tau |
| Drag / swipe | Velocity-tracked, throws up to ±2 cards, 0.22s tau |

`ITEMS` (top of `<script>`) is the single source of truth: `src` (real filename in `media/`),
`title` (displayed *fake* filename — display extensions intentionally differ from real ones,
e.g. `.webm` files display as `.mp4`), optional `sub` caption lines (plain string, or
`{text, href}` for a link), and layout knobs `w` (vw width), `dy` (px offset), `rz` (lean °).

Aspect ratios are read from the media itself on `loadedmetadata`/`load`, never hardcoded.
`media/README.md` and `media/descriptions.txt` document/source the display names.

Mobile (≤700px): tilt off, spacing 0.67, widths ×1.65 capped 92vw, dy ×3, lean ×1.6.

---

## 2. Changes made this session (all in `index.html`, all verified in-browser)

1. **Added `8.7.Website.webm`** to `ITEMS` between `8.5.readingZine` and `9.softServe`.
   Title `desire_website.mp4`, `w:50, dy:12, rz:1.1`, caption links to `http://www.desire.jewelry/`.
   Also added to `media/descriptions.txt`.

2. **Link-captioned cards became clickable.** In the card build loop, a card whose `sub`
   contains a `{text, href}` becomes an `<a target="_blank" rel="noopener">`. Generic — applies
   to the new desire.jewelry card, `13.Alter-modeNews` (CBC segment), `14.alterModePoster`.
   Two supporting fixes:
   - mousedown exclusion narrowed from `nav, #title, a` → `nav, #title` (cards are now anchors
     and must still drag).
   - `dragMoved` tracks px travelled; a card click past 5px is suppressed so a drag doesn't navigate.
   Verified: 120px drag scrolled 0.408 cards and did NOT navigate; a clean click did.

3. **Nav "Studio" → "About"**, plus a full-page About view (`#about`) with Arman's bio,
   centered in a 620px column. Desktop: text block 550px, needs 686px total → fits one page.
   Mobile: overflows (~975px of copy in ~670px), so the panel scrolls (`overflow-y:auto`,
   `touch-action: pan-y`, `overscroll-behavior: contain` — needed because body is `touch-action:none`).
   `Désiré` and `Alter-mode` are bold (`font-weight 600`) and link to
   `https://www.instagram.com/desires.atelier/` and `https://www.briqueparbrique.com/en/altermode`.

4. **Contact page** (`#contact`), same styling as About: line, `mailto:` link, optional email
   field, message textarea, Send button, "Opens in your mail app." hint.
   `setView()` generalized to three views; `overlayOpen` (was `aboutOpen`) freezes the carousel
   — cursor drift, drag, arrow keys all bail out, and **all videos pause** behind a page.

5. **Fixed a Work-page flash when switching About→Contact.** Both panels shared a 0.38s opacity
   transition, so mid-crossfade neither was opaque and the carousel showed through the gap.
   `setView()` now suppresses the transition for page→page swaps (instant), restoring it after,
   so work↔page still fades. Verified: combined screen coverage holds at 1.0 across the switch.

### Still open / decisions not made
- **Grammar error in About paragraph 2**: "My degree from Concordia in design and computer
  science, which meant learning 3D…" — no main verb. Needs "was in" or "I studied…". NOT edited;
  Arman's copy left verbatim pending his choice.
- **Contact form has no backend.** Send composes a `mailto:` and hands off to the visitor's mail
  app. A visitor with no mail client configured hits a dead end. Alternative: Formspree /
  Web3Forms (free tier, message passes through a third party). Undecided.
- ~~`media/8.7.Website.webm.xmp` — unused Adobe sidecar~~ — no longer present in `media/`.
- Email in About/Contact is `armanfaruqui@hotmail.com` (Arman once typed `hotmai.com` — typo).

---

## 3. iPhone Safari crash — FIXED (2026-07-25, later session)

**Symptom:** on Safari iOS the live site showed "A problem repeatedly occurred" and reloaded.
That is Safari's out-of-memory tab kill.

**Status: the plan below was executed in full.** What shipped is in §3.5. Everything from
"Diagnosis" through "Plan" is kept as the record of why.

### Diagnosis (measured, not guessed)

1. **All 10 videos are VP9 WebM.** iPhones have **no hardware VP9 decoder** — Safari plays it
   but decodes in *software*, on the CPU. This is the single biggest cause.
2. **`loadItem()` sets `preload='auto'` on every video** → all 10 (28.7 MB) fully buffer on load,
   not just visible ones.
3. **Images decode to 68.8 MB of bitmap** (file size is irrelevant; pixels × 4 bytes is what counts).

| File | Pixels | Decoded |
|---|---|---|
| 6.kisaWeb.jpg | 2134×1707 | 13.9 MB |
| 15.Cereal.jpg | 1870×1496 | 10.7 MB |
| 3.Gamja.jpg | 1631×1305 | 8.1 MB |
| 12.SeanWearing.jpg | 1600×1280 | 7.8 MB |
| (9 JPEGs total) | | **68.8 MB** |

Video sources: 1920×1280, 1500×1200 ×3, 1500×1080, 1500×900, 1000×1000, 844×1500 ×2, 800×1000.
Durations 4.6–16.3s. Files 0.2–6.8 MB.

### The reference: studiosubtract.com/works

Arman's site is modeled on this one (same nav, same filename-style captions). It has many
videos and does NOT crash on iPhone. Inspected 2026-07-25 — what they actually do:

- **MP4, not WebM.** `/assets/gallery/010.webm` → **404**; `010.mp4` → 200 `video/mp4`.
- **Tiny files:** 010.mp4 = 88 KB, 100.mp4 = 165 KB, 016.mp4 = 1.7 MB
  (vs Arman's 5.4 MB / 3.8 MB / 6.8 MB — roughly 30–80× larger).
- **Every video has a poster**, derived in code:
  `poster={item.src.replace(/\.mp4$/, "_poster.jpg")}`
- Video attrs: `autoPlay muted loop playsInline` + `onContextMenu` preventDefault,
  `controlsList="nodownload"`, `disablePictureInPicture`. **No `preload` attribute at all.**
- **Stills capped at 1400px long edge**, ~30–150 KB (e.g. 1400×1400 = 31 KB, 1400×1120 = 39 KB).
- **Posters at 960px long edge**, ~9–14 KB.
- Stack: single HTML, React 18 UMD + Babel standalone from unpkg, app inline in the 45 KB page.

### Plan (executed — see §3.5 for what actually shipped)

Write new files, leave originals untouched — output dir `media/web/`:

1. **Transcode all 10 videos → H.264 MP4**, cap 1200px long edge, drop audio, faststart:
   ```
   ffmpeg -y -i in.webm -vf "scale=w='min(1200,iw)':h='min(1200,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2:flags=lanczos" \
     -c:v libx264 -profile:v main -pix_fmt yuv420p -crf 26 -preset medium -movflags +faststart -an out.mp4
   ```
2. **Generate `<base>_poster.jpg`** at 960px long edge for each video:
   ```
   ffmpeg -y -i in.webm -frames:v 1 -vf "scale=w='min(960,iw)':h='min(960,ih)':force_original_aspect_ratio=decrease:flags=lanczos" -q:v 6 out_poster.jpg
   ```
3. **Downscale the 9 JPEGs** to 1400px long edge (`-q:v 4`), cutting ~68.8 MB decoded to ~30 MB.
4. **`index.html` changes:**
   - manifest `src` → `.mp4`; give each video card a `poster` attribute.
   - **remove `preload='auto'`** from `loadItem()` (this line is actively harmful).
   - mount/attach a video's `src` only when it is near center; detach when it leaves,
     so only 1–3 video elements are ever live.
   - `playNear` on mobile should be tightened (currently 1.5 → 3 videos play at once).

**Tooling available:** `ffmpeg` and `ffprobe` at `C:\PATH_Programs\` (`magick`/`cwebp` NOT installed).

### 3.5 What shipped

**`media/web/`** — new, 8.9 MB total. The 32.2 MB of originals in `media/` are untouched and
are no longer referenced by anything.

| | before | after |
|---|---|---|
| 10 videos | 28.7 MB VP9 WebM | 6.9 MB H.264 MP4, ≤1200px, no audio, faststart |
| 10 posters | — | 456 KB JPEG, ≤960px |
| 9 stills | 5.0 MB, up to 2134px | 1.8 MB, ≤1400px |
| icon.png | 49 KB @ 1254² (6.3 MB decoded, displayed at 66px) | 11 KB @ 256² |

Posters are grabbed at **20% of duration**, not frame 0 — three clips open on a white or black
fade and gave blank posters at frame 0. If a video is ever replaced, check its poster looks like
something.

**`index.html`** — the load model changed shape, not just paths:

- Manifest `src` → `.mp4`, all paths → `media/web/`.
- **A video's poster now does three jobs**: it's what the card paints before/after the file is
  attached, it supplies the aspect ratio (video `loadedmetadata` is no longer used for this),
  and its `load` event is the preloader's completion signal. So the preloader never touches a
  video file — startup is posters and stills only.
- `preload='auto'` is gone from `loadItem()`. Videos are attached by `attachVideo()` /
  released by `detachVideo()` on ring distance, with hysteresis:
  `VID_ON/VID_OFF` = 0.6/1.5 mobile, 2.6/3.6 desktop.
- `detachVideo()` does `pause()` → `removeAttribute('src')` → **`load()`**. The `load()` is the
  part that actually frees the buffer; without it the memory stays held.
- `c.media` was removed — `c.m` is the single media reference. `playNear` is gone, folded
  into `VID_ON`.
- The video `error` handler is guarded by `if (c.attached)`, because detaching calls `load()`
  with no src and that must not be mistaken for a broken file.

**Measured after the change** (local, port 4174):

- Cold load: **20 requests, ~2.2 MB, zero video bytes** (was 32 MB).
- Concurrent attached videos — **mobile: max 2** (was all 10 buffered, 3 playing);
  desktop: max 6.
- Detached cards sit at `networkState: 0` (NETWORK_EMPTY) with their poster painting.
- All 19 aspect ratios resolve correctly from posters/stills; no card falls back to placeholder.
- No page console errors. (Two "message channel closed" exceptions are Chrome-extension noise.)

**Not verified, and can't be from here:** actual playback, and the crash itself. `document.hidden`
is permanently true in both browser surfaces (§4), so no video ever reaches `readyState > 0`.
**This needs one pass on a real iPhone before it can be called done.**

Left undone deliberately:
- `media/` originals are still on disk — 32 MB of dead weight if the whole folder is deployed.
  Safe to exclude from upload, but keep them locally as the masters.
- `media/README.md` and `media/descriptions.txt` still describe the original filenames.

---

## 4. Environment gotchas

- **The Claude in-app Browser pane and the Chrome MCP tab both report `document.hidden: true`**
  (pane collapsed / tab sits behind another tab). Consequences: `requestAnimationFrame` is
  frozen, CSS transitions don't run, and **media never loads past `readyState 0`**.
  Screenshots DO still work through the Chrome MCP surface.
  Workaround used: call `frame(performance.now())` manually to force render passes, and use
  synthetic events. Do not trust timing/animation/media measurements taken while hidden —
  verify layout statically instead (computed styles, geometry).
- A local static server was left running on **port 4174** serving `ProductPortfolio`
  (background task `bwbo2ddsc`). Port 4173 served the old, now-empty `2026\` dir.
- `.claude/launch.json` names the server `portfolio-2026` on port 4173 — stale after the move.

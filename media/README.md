# media/

The carousel's files live here. The ring order, actual filenames, display
titles, and captions are all defined in the `ITEMS` manifest at the top of
the `<script>` in `../index.html` — `src` must match the real filename here
exactly; `title` (and optional `sub` caption lines / links) are what get
displayed at the bottom of the page.

Aspect ratios are read from the media files themselves, so nothing gets
cropped. Per-item layout knobs: `w` = card width in vw, `dy` = vertical
offset in px, `rz` = static lean in degrees. The carousel wraps infinitely,
so the list can be any length.

`descriptions.txt` is the source list of display names/captions.

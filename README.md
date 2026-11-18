# Odero Productions — oderoproductions.com

Corporate and event video production, Worthing, Sussex. Plain static site:
no frameworks, no build step. Deploy the folder as-is.

**Preview:** https://oderoproductions.github.io/odero-productions/

Brand direction: **Tungsten** (warm light in a dark room).

| Token | Value | Used for |
|---|---|---|
| Carbon | `#0F0D0B` | Background |
| Umber | `#1E1A16` | Panels |
| Bone | `#EFE7DA` | Type |
| Dust | `#A39A8C` | Secondary type |
| Tungsten | `#E8A23A` | The one accent |

Fonts: Instrument Serif (headlines) and Instrument Sans (everything else),
self-hosted in `assets/fonts/` under the SIL Open Font License.

## Editing

| Change | Where |
|---|---|
| Copy that needs checking | search `TODO` in the HTML files |
| Hero video | `index.html`, search `HERO VIDEO` |
| Work tiles | `index.html`, search `SELECTED WORK` |
| Project pages | `work/<slug>/index.html` |
| Client logos | `index.html`, search `TRUSTED BY`; files in `assets/clients/` |
| Accent colour | `styles.css`, `--tungsten` |
| Logo files | `assets/brand/` |

## Logo files (`assets/brand/`)

- `odero-logo-on-dark.svg` / `-on-light.svg`: full logo (mark, Odero, PRODUCTIONS)
- `odero-logo-compact-on-dark.svg` / `-on-light.svg`: mark and Odero, for small sizes
- `odero-mark-on-dark.svg` / `-on-light.svg`: the ring-and-dot mark alone
- `odero-watermark-white.svg` / `.png`: all-white, for the corner of footage
- `odero-logo-*.png`: 2000px exports, with and without a background
- `favicon.svg`, `favicon-48.png`, `apple-touch-icon.png`, `og.png`: site icons and share card

All text in the SVGs is converted to outlines, so they work with no font installed.

## Adding a project

1. Export a poster frame as a 720 x 1280 JPG into `assets/work/<slug>.jpg`.
2. Copy a folder in `work/`, rename it, and update the title, text and the
   `data-video` ID (the Cloudflare Stream video ID).
3. Copy a tile in `index.html` (search `SELECTED WORK`) and point it at the new page.

## Going live on oderoproductions.com

1. Delete the `<meta name="robots" content="noindex">` line from every HTML file.
2. In `404.html`, replace `/odero-productions/` with `/`.
3. Add a `CNAME` file containing `oderoproductions.com`, and set the custom
   domain in the repo's Pages settings.
4. Point the domain's DNS at GitHub Pages (four A records and a `www` CNAME).
5. Add a `sitemap.xml` and reference it from `robots.txt`.

## Notes

- A Content-Security-Policy meta tag blocks inline scripts and inline
  `style=""` attributes. Keep scripts in `script.js` and styles in `styles.css`.
- Videos play from Cloudflare Stream and only load when a visitor presses play.
- No cookies, analytics or forms. See `privacy.html`.

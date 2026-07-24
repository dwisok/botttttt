# keeper — front

Front-end for keeper: the **landing page** plus a **live demo**, built with
**Vite + React** using plain **npm** (no pnpm / corepack, so the deploy can't hit the
`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` corepack crash).

The two pages are kept exactly as authored — Vite bundles their assets and emits a
static `dist/` you can serve anywhere.

## Contents

| Path             | What it is                                        |
|------------------|---------------------------------------------------|
| `index.html`     | The **keeper** landing page (homepage, `/`)       |
| `demo.html`      | The keeper ops console — **live demo** (`/demo`)  |
| `k1-photo.png`   | image used by the landing                         |
| `public/.htaccess` | serves `index.html` at `/`, maps `/demo` → `demo.html` (copied into `dist/`) |
| `vite.config.js` | multi-page Vite build (keeper + demo)             |

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173  (landing) and /demo
```

## Build

```bash
npm install
npm run build      # -> dist/  (static: index.html, demo.html, assets/, .htaccess)
npm run preview    # optional: serve the built dist/ locally
```

## Deploy on Hostinger (npm build)

Hostinger runs the build at deploy time. In hPanel → **Advanced → GIT** (or the
Node/deploy settings), set:

- **Install + build command:** `npm install && npm run build`
- **Publish / output directory:** `dist`

Then the web root serves `dist/` — `/` is the keeper landing and `/demo` is the demo.

> First deploy only: if the site still shows an old page, **clear `public_html` of
> any leftover files from a previous deploy** (an old `index.html` / `assets/` can
> otherwise take priority), then redeploy and hard-refresh (Ctrl+F5).

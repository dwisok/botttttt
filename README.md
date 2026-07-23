# keeper — front

Front-end only. **No backend** (no services, smart contracts, docker, and no pnpm
monorepo) and **no demo page**. Because there is no `pnpm-lock.yaml` /
`packageManager: pnpm` at the repo root, a host never runs `pnpm install` through
corepack — so the deploy can't hit the
`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` crash. Everything here installs with plain
**npm**, and the landing pages need no install at all.

## Contents

| Path                  | What it is                                    | Runtime |
|-----------------------|-----------------------------------------------|---------|
| `keeper-landing.html` | The **keeper** landing page (homepage, `/`)   | static  |
| `index.html`          | The **Sentinel** landing page (`/index.html`) | static  |
| `k1-photo.png`, `s1-hero.png` | images used by the landings           | static  |
| `.htaccess`           | maps `/` → `keeper-landing.html`              | static  |
| `web/`                | **Sentinel AI** app — React + Vite + Tailwind | npm     |
| `asme/`               | **Asme** app — React + Vite + Tailwind        | npm     |

## Run locally

Landing pages (no build needed) — open `keeper-landing.html` directly, or serve the
folder with any static server:

```bash
npx --yes serve .        # then open http://localhost:3000
```

React apps:

```bash
cd web   && npm install && npm run dev     # http://localhost:5173
cd asme  && npm install && npm run dev
```

## Build the React apps (for deploy)

```bash
cd web  && npm install && npm run build    # -> web/dist
cd asme && npm install && npm run build    # -> asme/dist
```

## Deploy (Hostinger — static, corepack-proof)

The homepage is static, so the simplest reliable deploy is **static hosting**
(`public_html`), which has **no install step**:

1. Upload `keeper-landing.html`, `index.html`, `k1-photo.png`, `s1-hero.png`,
   and `.htaccess` into `public_html`.
2. Open `https://<your-domain>/` (keeper landing).

To also ship the React apps, `npm run build` each and upload its `dist/` into a
subfolder (set Vite `base` to that subpath first, e.g. `base: '/app/'`).

## Known gaps

- `index.html` (Sentinel landing) references **`s1-hero.mp4`** and **`s1-photo.png`**,
  which are **not** in this repo — add them to the root or those elements will 404.
  The keeper landing (`keeper-landing.html`) has no missing assets.

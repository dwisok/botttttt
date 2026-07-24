# keeper — front

Front-end only. **No backend, no build, no install.** Just static HTML — the keeper
landing page plus a live demo. A host never runs any package manager here, so the
deploy can't hit the `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` corepack crash.

## Contents

| Path           | What it is                                  | Runtime |
|----------------|---------------------------------------------|---------|
| `index.html`   | The **keeper** landing page (homepage, `/`) | static  |
| `demo.html`    | The keeper ops console — **live demo** (`/demo`) | static |
| `k1-photo.png` | image used by the landing                   | static  |
| `.htaccess`    | serves `index.html` at `/`                  | static  |

## Run locally

No build needed — open `index.html` directly, or serve the folder with any static
server:

```bash
npx --yes serve .        # then open http://localhost:3000  (landing)
                         #      and  http://localhost:3000/demo
```

## Deploy (Hostinger — static)

The whole site is static, so deploy is a plain file copy — no install/build step:

1. Upload `index.html`, `demo.html`, `k1-photo.png`, and `.htaccess` into the web
   root (`public_html`). **Remove any leftover files from previous deploys** so an
   old `index.html`/`assets/` can't take priority.
2. Open `https://<your-domain>/` (keeper landing) and `https://<your-domain>/demo`.

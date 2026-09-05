# Ascesius

Next.js (Pages Router) + Tailwind CSS starter. This is the shared base — pull `main`, then work on your own page in a feature branch.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Folder structure

```
pages/
  _app.jsx        # global app wrapper — imports styles/globals.css
  _document.js    # HTML document shell (default, rarely needs edits)
  index.jsx       # home page
  servers.jsx
  marketplace.jsx
  admin.jsx
  grievance.jsx
  api/            # API routes (server-side, mapped to /api/*)
styles/
  globals.css     # Tailwind directives + global styles
public/           # static assets (images, icons, etc.)
```

Each page file is currently a placeholder. Build out your section inside your assigned file — try to keep shared UI (buttons, cards, nav, etc.) in a `components/` folder as it emerges, rather than duplicating markup across pages.

## Page ownership

| Page | File | Owner |
|---|---|---|
| Home | `pages/index.jsx` | TBD |
| Servers | `pages/servers.jsx` | TBD |
| Marketplace | `pages/marketplace.jsx` | TBD |
| Admin | `pages/admin.jsx` | TBD |
| Grievance | `pages/grievance.jsx` | TBD |

Fill in owners once assigned, so it's clear who to ping about a given page.

## Branch conventions

- `main` is protected — no direct pushes. All work lands via PR.
- Branch naming: `<type>/<short-description>`, e.g. `feature/marketplace-listing-card`, `fix/admin-nav-overflow`.
- Common `<type>` prefixes: `feature/`, `fix/`, `chore/`, `refactor/`.
- Keep PRs scoped to your page/feature where possible — smaller PRs are easier to review and less likely to conflict with others working in parallel.
- Rebase (or merge `main` in) before opening a PR if `main` has moved on since you branched.
- At least one review before merging.

## Styling

- Tailwind utility classes are the default styling approach — avoid custom CSS files unless something can't be expressed with utilities.
- This scaffold uses **Tailwind v4** (`@import "tailwindcss";` in `styles/globals.css`), not the v3 `@tailwind base/components/utilities;` directives. Keep that in mind if you're referencing older Tailwind docs/tutorials.

## Scripts

```bash
npm run dev     # start dev server
npm run build   # production build
npm run start   # run production build locally
npm run lint    # eslint
```

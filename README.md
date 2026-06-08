# Aerostar Mobile Website

Mobile-first marketing site for Aerostar Aviation Academy (390px layout). Built with React, TypeScript, Vite, and Tailwind CSS v4.

## Develop

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5173/

## Build

```bash
npm run build
npm run preview
```

## Git / GitHub

Remote: https://github.com/aayushaboss/aerostarjet-mobile-website.git

Cursor edits are **not** synced to GitHub automatically. After changes, commit and push:

```bash
git status
git add .
git commit -m "Describe what changed and why"
git push origin main
```

Ask the agent to **commit and push** when you want the latest version on GitHub.

## Project structure

- `src/pages/` — route pages (Home, Courses, Placements, About, Contact, etc.)
- `src/components/` — layout, UI, and section components
- `src/data/content.ts` — copy, navigation, courses, FAQs
- `public/assets/` — images and icons
- `src/index.css` — Tailwind theme tokens and utilities (including `.text-description` at 12px)

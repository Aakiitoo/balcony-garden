# Balcony Garden Tracker

A personal website for tracking fruit and vegetable plants on balconies and in pots.

**Live site:** [https://aakiitoo.github.io/balcony-garden/](https://aakiitoo.github.io/balcony-garden/)

## Features

- **My Plants** — Log what you are growing or planning. Photos, dates, pot size, watering, notes.
- **Success & problem notes** — What works and what does not, per plant.
- **Tailored guides** — Sunlight, diseases, fertilizers, and companions only for plant types you have added.

Your plant list and photos are stored in **your browser** (localStorage), so they stay on your device and are not sent to a server.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Preview the GitHub Pages build locally:

```bash
npm run build:pages
npx serve out
```

Then open `http://localhost:3000/balcony-garden/` (or the URL `serve` prints).

## GitHub Pages deployment

Pushes to `master` run `.github/workflows/deploy-pages.yml`, which builds a static export and publishes to GitHub Pages.

**One-time repo setting:** On GitHub, go to **Settings → Pages → Build and deployment** and set source to **GitHub Actions**.

## Data notes

- Reference guides (sunlight, pests, etc.) are bundled with the app.
- Your plants and photos live in browser storage on each device separately.
- Clearing site data in the browser removes your plants.

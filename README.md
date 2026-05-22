# Balcony Garden Tracker

A personal website for tracking fruit and vegetable plants on balconies and in pots.

## Features

- **My Plants** — Log what you are growing now or plan to plant. Store planting date, location, pot size, watering schedule, photos, and general notes.
- **Success & problem notes** — Record what is working well and what is not, per plant.
- **Sunlight guide** — Hours needed and whether plants want direct sun, indirect light, partial shade, or shade.
- **Diseases & pests** — Symptoms, prevention, organic treatments, chemical options, and which approach is usually better.
- **Fertilizers** — What to use, growth stage, frequency, and application notes.
- **Companion planting** — Plants that work well in the same pot vs combinations to avoid.

Reference data is pre-seeded for common balcony crops (tomato, basil, strawberry, pepper, lettuce, mint, cucumber, dwarf blueberry). You can extend the database later.

## Getting started

```bash
cd balcony-garden
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Data is stored locally in `data/garden.db`. Plant photos are saved in `public/uploads/`.

## Production

```bash
npm run build
npm start
```

Run on a machine you control — data stays on that server’s filesystem unless you add cloud storage later.

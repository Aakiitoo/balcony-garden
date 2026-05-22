import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

type Db = BetterSQLite3Database<typeof schema>;

export function seedDatabase(db: Db) {
  const plants = [
    {
      name: "Tomato (Cherry)",
      category: "vegetable",
      sunlightHours: "6–8 hours",
      sunlightType: "direct",
      sunlightNotes:
        "South-facing balcony ideal. Less than 6h reduces fruit set.",
      waterFrequency: "Daily in summer, when top 2cm soil is dry",
      waterNotes:
        "Avoid wetting leaves. Consistent moisture prevents blossom end rot.",
      potSizeMinLiters: 15,
      potSizeNotes: "One plant per 15–20L pot minimum for balcony growing.",
      growingTips: "Stake or cage early. Pinch suckers on indeterminate varieties.",
    },
    {
      name: "Basil",
      category: "herb",
      sunlightHours: "6+ hours",
      sunlightType: "direct",
      sunlightNotes: "Happy in full sun; grows leggy in shade.",
      waterFrequency: "Every 1–2 days in warm weather",
      waterNotes: "Let soil dry slightly between waterings. Water in morning.",
      potSizeMinLiters: 3,
      potSizeNotes: "3–5L pot; can combine with tomatoes in larger containers.",
      growingTips: "Pinch flowers to keep leaves tender. Harvest from the top.",
    },
    {
      name: "Strawberry",
      category: "fruit",
      sunlightHours: "6+ hours",
      sunlightType: "direct",
      sunlightNotes: "Partial shade tolerated but fewer berries.",
      waterFrequency: "Every 1–2 days; keep evenly moist",
      waterNotes: "Avoid crown rot—water soil, not crown. Good drainage essential.",
      potSizeMinLiters: 5,
      potSizeNotes: "5L per plant or trough with 3 plants per 30L.",
      growingTips: "Remove runners on young plants to focus on fruit.",
    },
    {
      name: "Bell Pepper",
      category: "vegetable",
      sunlightHours: "6–8 hours",
      sunlightType: "direct",
      sunlightNotes: "Warm spot; sheltered from cold wind on balconies.",
      waterFrequency: "Every 2–3 days; more when fruiting",
      waterNotes: "Irregular watering causes blossom drop.",
      potSizeMinLiters: 10,
      potSizeNotes: "10–15L per plant.",
      growingTips: "Support stems when fruit loads. Slow to ripen in cool summers.",
    },
    {
      name: "Lettuce",
      category: "vegetable",
      sunlightHours: "4–6 hours",
      sunlightType: "partial",
      sunlightNotes:
        "Tolerates partial shade; bolt-resistant varieties for sunny balconies.",
      waterFrequency: "Daily in heat; keep soil consistently moist",
      waterNotes: "Shallow roots—don't let pots dry out completely.",
      potSizeMinLiters: 3,
      potSizeNotes: "Shallow wide pots; 3L+ for loose-leaf.",
      growingTips: "Harvest outer leaves for cut-and-come-again.",
    },
    {
      name: "Mint",
      category: "herb",
      sunlightHours: "4–6 hours",
      sunlightType: "partial",
      sunlightNotes: "Prefers morning sun; afternoon shade OK.",
      waterFrequency: "Every 1–2 days",
      waterNotes: "Likes moisture but needs drainage. Very thirsty in pots.",
      potSizeMinLiters: 5,
      potSizeNotes: "Always grow in its own pot—spreads aggressively.",
      growingTips: "Never plant mint with other herbs in the same pot.",
    },
    {
      name: "Cucumber (Bush)",
      category: "vegetable",
      sunlightHours: "6–8 hours",
      sunlightType: "direct",
      sunlightNotes: "Needs warmth; protect from cold nights early season.",
      waterFrequency: "Daily when fruiting",
      waterNotes: "High water needs; mulch surface to reduce evaporation.",
      potSizeMinLiters: 15,
      potSizeNotes: "15–20L minimum; bush types suit balconies.",
      growingTips: "Harvest regularly to keep plants producing.",
    },
    {
      name: "Blueberry (Dwarf)",
      category: "fruit",
      sunlightHours: "6+ hours",
      sunlightType: "direct",
      sunlightNotes: "Morning sun + afternoon shade OK in hot climates.",
      waterFrequency: "Every 2–3 days; keep acidic moist soil",
      waterNotes: "Rainwater preferred. Never let pot dry completely.",
      potSizeMinLiters: 15,
      potSizeNotes: "15–25L; needs ericaceous (acidic) compost.",
      growingTips: "Two varieties improve pollination even on balconies.",
    },
  ];

  for (const p of plants) {
    db.insert(schema.plantCatalog).values(p).run();
  }

  const diseases = [
    {
      plantCatalogId: 1,
      name: "Early blight",
      symptoms: "Brown spots with concentric rings on lower leaves",
      prevention: "Spacing, avoid overhead watering, remove affected leaves",
      organicTreatment:
        "Neem oil spray; copper fungicide; improve airflow; remove infected foliage",
      chemicalTreatment: "Chlorothalonil or mancozeb fungicides",
      recommendation: "organic_preferred",
    },
    {
      plantCatalogId: 1,
      name: "Powdery mildew",
      symptoms: "White powdery coating on leaves",
      prevention: "Good airflow, don't overcrowd pots",
      organicTreatment:
        "Milk spray (1:9 with water); potassium bicarbonate; sulfur dust",
      chemicalTreatment: "Myclobutanil or tebuconazole",
      recommendation: "organic_preferred",
    },
    {
      plantCatalogId: 3,
      name: "Gray mold (Botrytis)",
      symptoms: "Fuzzy gray mold on fruit and flowers",
      prevention: "Remove dead material, avoid wet fruit, spacing",
      organicTreatment:
        "Remove infected berries; baking soda spray; improve ventilation",
      chemicalTreatment: "Fungicides containing fenhexamid (last resort)",
      recommendation: "organic_preferred",
    },
    {
      plantCatalogId: null,
      name: "Aphids",
      symptoms: "Clusters on new growth, sticky honeydew, curled leaves",
      prevention: "Encourage ladybugs; check undersides of leaves weekly",
      organicTreatment:
        "Spray with soapy water; introduce beneficial insects; strong water jet",
      chemicalTreatment: "Pyrethrin sprays; systemic insecticides (avoid on edibles)",
      recommendation: "organic_preferred",
    },
    {
      plantCatalogId: null,
      name: "Spider mites",
      symptoms: "Fine webbing, stippled yellow leaves, worse in dry heat",
      prevention: "Increase humidity; mist in dry weather; regular inspection",
      organicTreatment:
        "Increase watering; neem oil; predatory mites for severe cases",
      chemicalTreatment: "Abamectin sprays",
      recommendation: "organic_preferred",
    },
    {
      plantCatalogId: 7,
      name: "Powdery mildew (cucumber)",
      symptoms: "White patches on leaves, reduced vigor",
      prevention: "Resistant varieties; morning watering",
      organicTreatment: "Sulfur or potassium bicarbonate; remove worst leaves",
      chemicalTreatment: "Triazole fungicides",
      recommendation: "organic_preferred",
    },
  ];

  for (const d of diseases) {
    db.insert(schema.diseases).values(d).run();
  }

  const fertilizers = [
    {
      plantCatalogId: 1,
      name: "Balanced organic (e.g. compost tea)",
      type: "organic",
      npk: "5-5-5",
      growthStage: "seedling",
      frequency: "Every 2 weeks after first true leaves",
      applicationNotes:
        "Dilute compost tea to weak tea color. Avoid overfeeding seedlings.",
    },
    {
      plantCatalogId: 1,
      name: "Potassium-rich feed",
      type: "both",
      npk: "5-10-10",
      growthStage: "flowering/fruiting",
      frequency: "Every 10–14 days when flowers appear",
      applicationNotes:
        "Switch from high-nitrogen to potassium/phosphorus for fruit. Organic: comfrey or banana peel tea.",
    },
    {
      plantCatalogId: 2,
      name: "Light nitrogen feed",
      type: "organic",
      npk: "4-4-4",
      growthStage: "vegetative",
      frequency: "Monthly",
      applicationNotes: "Basil is a light feeder. Over-fertilizing reduces flavor.",
    },
    {
      plantCatalogId: 3,
      name: "Berry fertilizer",
      type: "both",
      npk: "4-3-6",
      growthStage: "flowering/fruiting",
      frequency: "Every 2 weeks during fruiting",
      applicationNotes: "Use low-chloride fertilizer. Organic options: seaweed extract.",
    },
    {
      plantCatalogId: 8,
      name: "Ericaceous fertilizer",
      type: "both",
      npk: "4-3-6",
      growthStage: "all stages",
      frequency: "Monthly spring–summer",
      applicationNotes:
        "Must use acidic fertilizer. Regular tomato feed will harm blueberries.",
    },
    {
      plantCatalogId: 6,
      name: "Compost top-dress",
      type: "organic",
      npk: "—",
      growthStage: "vegetative",
      frequency: "Once at planting, light top-up mid-season",
      applicationNotes: "Lettuce needs little fertilizer. Rich soil at start is enough.",
    },
  ];

  for (const f of fertilizers) {
    db.insert(schema.fertilizers).values(f).run();
  }

  const companions = [
    {
      plantA: "Tomato",
      plantB: "Basil",
      relationship: "good",
      samePot: true,
      notes:
        "Classic pairing. Basil may repel some pests and is said to improve tomato flavor. Share a large 20L+ pot.",
    },
    {
      plantA: "Tomato",
      plantB: "Mint",
      relationship: "bad",
      samePot: true,
      notes:
        "Mint overtakes roots and space. Keep mint in a separate pot on the same balcony only.",
    },
    {
      plantA: "Tomato",
      plantB: "Cucumber",
      relationship: "bad",
      samePot: true,
      notes:
        "Different water and nutrient needs; shared pot increases disease spread (e.g. mildew).",
    },
    {
      plantA: "Lettuce",
      plantB: "Strawberry",
      relationship: "good",
      samePot: true,
      notes:
        "Lettuce acts as living mulch, keeping strawberry soil cool. Use wide shallow trough.",
    },
    {
      plantA: "Bell Pepper",
      plantB: "Basil",
      relationship: "good",
      samePot: true,
      notes: "Basil repels aphids and whiteflies. Similar sun needs.",
    },
    {
      plantA: "Bell Pepper",
      plantB: "Cucumber",
      relationship: "bad",
      samePot: true,
      notes: "Cucumbers need more water; peppers suffer from soggy soil.",
    },
    {
      plantA: "Strawberry",
      plantB: "Mint",
      relationship: "bad",
      samePot: true,
      notes: "Mint runners will choke strawberry plants within one season.",
    },
    {
      plantA: "Basil",
      plantB: "Mint",
      relationship: "bad",
      samePot: true,
      notes: "Mint dominates; basil becomes stunted.",
    },
    {
      plantA: "Lettuce",
      plantB: "Cucumber",
      relationship: "good",
      samePot: false,
      notes:
        "Lettuce benefits from cucumber shade in hot balconies. Adjacent pots, not same pot.",
    },
    {
      plantA: "Blueberry",
      plantB: "Tomato",
      relationship: "bad",
      samePot: true,
      notes:
        "Blueberries need acidic soil (pH 4.5–5.5); tomatoes need neutral. Never share soil.",
    },
  ];

  for (const c of companions) {
    db.insert(schema.companions).values(c).run();
  }
}

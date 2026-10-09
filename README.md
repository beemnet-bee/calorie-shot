# CalorieShot

### Snap it. Know it. Track it.

**Live Demo:** [https://calorie-shot.space-z.ai/](https://calorie-shot.space-z.ai/)

CalorieShot is a premium, AI-powered nutrition tracking Progressive Web App (PWA). Take a photo of your meal, and a Vision Language Model identifies every food item, estimates portion sizes, and calculates complete nutritional values — calories, protein, carbs, fat, fiber, sugar, sodium, and more.

Built with a special focus on **Ethiopian and African cuisine** — dishes like Injera, Doro Wot, Shiro, Tibs, and Kitfo that traditional calorie trackers can't recognize.

---

## Features

- **AI Meal Recognition** — Snap a photo → AI detects individual foods → estimates portions + nutrition automatically
- **Manual Entry** — Log meals without a photo (perfect for dining out with friends)
- **Ethiopian Food Database** — 22+ traditional dishes with per-100g nutrition data
- **Past Date Logging** — Add meals to any day in your history (forgot to log yesterday? No problem)
- **Full History** — View all days you've ever logged, not just the last week
- **Calendar Date Picker** — Jump to any date instantly
- **Daily Dashboard** — Animated progress rings + macro bars with live counts
- **Analytics** — Calorie trend charts, macro distribution donut, protein intake line chart
- **Light/Dark Theme** — Toggle between themes; system preference auto-detected
- **Offline-First** — All data stored in IndexedDB; works fully offline after first load
- **PWA Installable** — Install as a real app on your home screen (Android, iOS, Desktop)
- **Custom SVG Icons** — 60+ hand-drawn icons (no emoji), consistent visual identity
- **Responsive** — Mobile-first with desktop sidebar + multi-column grids
- **Editable Results** — Correct any AI estimate: rename, adjust portions, add/remove foods
- **AI/User Badges** — Every food clearly labeled as "AI Estimated" or "User Confirmed"

---

## Prerequisites

- **Node.js 18+** (or Bun runtime)
- **ZAI API Key** — for the AI vision model (provided via environment variable)

---

## Setup

### 1. Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
ZAI_API_KEY=your_api_key_here
```

> The API key is used server-side only (in `/api/analyze-meal`) and is never exposed to the client.

### 3. Initialize Database (Optional)

If using Prisma for server-side data:

```bash
bun run db:push
```

### 4. Run Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage Guide

### First Launch

1. **Onboarding** — 3 intro slides explaining the "Snap → Know → Track" flow
2. **Goal Setup** — Pick a preset (Cut / Maintain / Bulk) or adjust sliders for daily calories + macros
3. **Start Tracking** — You're on the Home dashboard

### Logging a Meal

#### Option A: Photo Scan (AI-powered)

1. Tap the green **Scan** button (center of bottom nav on mobile, sidebar on desktop)
2. Tap **Open camera** or **Upload from gallery**
3. Take or select a photo of your meal
4. Tap **Analyze**
5. Watch the 5-step AI analysis animation (Detecting → Identifying → Portioning → Calculating → Preparing)
6. Review the results — AI shows detected foods with serving sizes + nutrition
7. Edit any food if needed (tap a food row → adjust grams, calories, or macros)
8. Tap **Confirm & save** (or **Save as estimate** to keep AI values without confirming)

#### Option B: Manual Entry (no photo needed)

1. Tap **Scan**
2. Tap **"Or log a meal manually — no photo needed"**
3. Enter a meal name (optional — auto-fills from first food)
4. Select meal type (Breakfast / Lunch / Dinner / Snack)
5. Tap **Add first food** → search the food database (Ethiopian + international)
6. Adjust serving size if needed (nutrition auto-recalculates)
7. Add more foods as needed
8. Tap **Save meal**

### Logging to a Past Day

1. Go to **History** page
2. Tap **Pick a date** (calendar button at end of date strip) → select any past date
   - Or tap a day in the date strip (shows last 7 days + all days with meals)
3. Tap **Add meal to this day**
4. Use the manual entry sheet to log the meal to that specific date

### Viewing Your Data

- **Home** — Today's calorie ring + macro progress bars + recent meals
- **History** — Date strip + daily summary + meal cards (tap to expand details)
- **Insights** — Calorie trend (bar chart), macro distribution (donut), protein intake (line chart)
- **Profile** — Stats, theme toggle, PWA install, nutrition goals, activity level, dietary preference

### Theme & Installation

- **Theme toggle** — Sun/Moon icon in the header (mobile) or sidebar (desktop)
- **Install as app** — Profile page → "Install CalorieShot app" button (appears when browser supports PWA install)
- **Offline mode** — App works fully offline after first load (except AI scanning which requires internet)

---

## Project Structure

```
calorieshot/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (theme, font, metadata)
│   │   ├── page.tsx                # Single route — CalorieShotApp
│   │   ├── globals.css             # Design system (colors, radii, utilities)
│   │   └── api/analyze-meal/route.ts  # AI vision endpoint
│   ├── components/calorieshot/     # 23 custom components
│   │   ├── app.tsx                 # App shell + routing + splash
│   │   ├── provider.tsx            # Global state (meals, goals, theme, PWA)
│   │   ├── scan-page.tsx           # Camera + upload + manual entry flow
│   │   ├── results-view.tsx        # Editable AI results
│   │   ├── manual-entry-view.tsx   # Manual meal logging
│   │   ├── history-page.tsx        # Date strip + calendar + meal list
│   │   ├── analytics-page.tsx      # Charts (bar, donut, line)
│   │   ├── icons.tsx               # 60+ custom SVG icons
│   │   └── ...
│   └── lib/
│       ├── db-calorieshot.ts       # IndexedDB schema (Dexie)
│       ├── food-database.ts        # 40+ food entries
│       ├── nutrition-utils.ts      # Daily totals + date helpers
│       └── image-utils.ts          # Image compression
├── public/
│   ├── manifest.webmanifest        # PWA manifest
│   ├── sw.js                       # Service worker
│   ├── icon-192.png                # PWA icon
│   └── icon-512.png                # PWA icon
├── scripts/
│   └── generate_icons.py           # Icon generation script
└── package.json
```

---

## NPM Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server (port 3000) |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run db:push` | Push Prisma schema to database |
| `bun run db:generate` | Generate Prisma client |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion 13 |
| Local DB | Dexie (IndexedDB) |
| AI Model | Z-AI Vision LLM (GLM-5V-Turbo) via z-ai-web-dev-sdk |
| PWA | Web App Manifest + Service Worker |
| Fonts | Space Grotesk (via next/font) |
| Icons | 60+ custom hand-drawn SVGs |

---

## Deployment

### Deploy to Vercel / Netlify / Custom Server

1. Set the `ZAI_API_KEY` environment variable on your hosting platform
2. Build and deploy:
   ```bash
   bun run build
   bun run start
   ```
3. Ensure HTTPS is enabled (required for camera access + service worker)

### Deploy as Android APK (Capacitor)

The PWA architecture is Capacitor-ready:

1. Install Capacitor:
   ```bash
   npm install @capacitor/core @capacitor/cli
   ```
2. Initialize:
   ```bash
   npx cap init CalorieShot ai.calorieshot.app
   ```
3. Build the web app:
   ```bash
   bun run build
   ```
4. Add Android platform:
   ```bash
   npm install @capacitor/android
   npx cap add android
   npx cap copy
   ```
5. Open in Android Studio:
   ```bash
   npx cap open android
   ```
6. Build APK/AAB from Android Studio

---

## AI/ML Component

CalorieShot qualifies as a complete AI/ML application:

- **AI/ML Component:** Vision Language Model (GLM-5V-Turbo) for food image analysis
- **User Input:** Meal photograph (via camera or upload)
- **Data/Model Processing:** Multi-label food classification + portion estimation + nutrition calculation
- **Meaningful Output:** Structured nutrition estimates (calories, macros, micronutrients) with confidence scores
- **Real-World Problem:** Ethiopian and African cuisine lacks calorie/nutrition data in standard databases (USDA, MyFitnessPal, etc.)

See `CALORIESHOT_AI_ML_QUALIFICATION.md` for a detailed assessment.

---

## License

This project is provided as-is for educational and personal use.

---

## Acknowledgments

- **Z-AI** for the Vision Language Model API
- **Space Grotesk** font by Florian Karsten
- **shadcn/ui** for the base component library
- **Dexie** for the IndexedDB wrapper
- **Framer Motion** for animation primitives

---

*CalorieShot v1.0 — August 2026*

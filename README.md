# Goldie V2 — Investor Prototype

A polished, click-through demo showcasing the **CARESTREAM™** and **DART™** patent-pending technologies for substance use disorder care coordination.

## 🎯 Demo Story (5-min walkthrough)

1. **Login** → `demo@goldie.health` / `goldie2026`
2. **County Dashboard** → KPI cards, heatmap, critical alerts
3. **Detection Feed** → Live EMS/ED events streaming in, auto-scored by DART
4. **Patient Profile → CARESTREAM™** → Marcus Johnson's full health journey on a 2D timeline
5. **DART Assessment** → Rubric score + AI analysis + multi-dimensional risk radar
6. **Service Plan** → AI-generated interventions with providers, accept to activate
7. **Active Cases** → Closed-loop architecture — outcomes flow back to CARESTREAM
8. **Analytics** → County-level population intelligence

## 🚀 Quick Start

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
# Opens on http://localhost:5173
```

### Backend (Express + Claude API)
```bash
cd backend
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm install
npm run dev
# Runs on http://localhost:3002
```

## 📐 Architecture

```
goldie-v2-prototype/
├── frontend/                    # React 19 + Vite + Tailwind v4
│   └── src/
│       ├── components/
│       │   ├── Layout.tsx       # Dark sidebar nav
│       │   ├── CareStreamViz.tsx # ★ Hero SVG visualization
│       │   └── DartPanel.tsx    # Risk assessment panel
│       ├── pages/               # All screens
│       ├── data/                # Mock JSON (patients, HEAP events, providers)
│       └── lib/
│           ├── carestream.ts    # HEAP → PHT → PHS derivation
│           └── dart-scoring.ts  # DART rubric scoring
├── backend/                     # Express.js
│   └── src/server.ts            # /api/assess — Claude integration
└── render.yaml                  # One-click Render deployment
```

## 🔑 Key Features

### CARESTREAM™ Timeline
- Custom SVG visualization — 2D grid: time × domain
- 4 domains: SUD, Mental Health, Social Determinants, Medical
- Interactive hover → PHS (Patient Health State) vertical slice
- Color-coded severity: green → yellow → orange → red
- Animated event drawing on load

### DART™ Risk Assessment
- Rubric Score: evidence-based factor scoring (overdose history, substances, housing, etc.)
- AI Score: Claude-powered pattern analysis (real API call — wow factor)
- Risk Vector: 6-dimensional radar chart
- Red flags with immediate action items

### Demo Patient: Marcus Johnson
34M, 4 overdoses (accelerating), fentanyl + benzos, recently released from jail, Hep C, in emergency shelter. The perfect high-complexity case to demo the full story arc.

## 🎨 Design System
- **Navy**: `#1a1a2e` (sidebar, hero text)
- **Gold**: `#D4A843` (accent, CTAs, brand)
- **Stack**: Tailwind CSS v4, no component library dependency (custom components)

## 🌐 Deploy to Render
```bash
# Push to GitHub, then connect to Render
# Configure ANTHROPIC_API_KEY in Render env vars
# render.yaml handles everything else
```

---

*CARESTREAM™ and DART™ are patent-pending technologies of Goldie Health, Inc.*

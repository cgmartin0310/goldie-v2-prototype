# Goldie V2 Prototype — Investor Demo Spec

**Goal:** A polished, click-through prototype that demonstrates the Carestream + DART architecture with mock data. This is for investor meetings — it needs to tell a compelling story, not process real patients.

**Timeline:** 1 week (AI-built, parallel agents)
**Stack:** Single repo. React + Vite + Tailwind CSS + shadcn/ui. Lightweight Express backend for AI demo only.

---

## The Investor Story (5-Minute Demo Flow)

### Act 1: "The Problem" → Dashboard
*"50% of overdose victims refuse transport. Only 6.4% initiate treatment within 30 days. Why? Because the system doesn't connect the dots."*

**Screen: County Dashboard**
- Map view showing county with heat zones (overdose incidents)
- KPI cards: Active patients, High-risk alerts, Interventions this month, 30-day MOUD initiation rate
- Recent alerts feed (real-time feel)
- "Let me show you a specific patient..."

### Act 2: "Detection" → Patient Detection
*"An EMS crew just responded to an overdose call. The moment that ePCR is filed, Goldie detects the patient."*

**Screen: Detection Feed**
- Incoming EMS/ED events streaming in (animated)
- New patient flagged: "Marcus Johnson, 34M — Overdose, Narcan administered in field"
- One-click to open patient profile
- Shows DART scoring beginning automatically

### Act 3: "The Carestream" → Patient Profile (Hero Screen)
*"This is the Carestream — our patent-pending approach to understanding a patient's full health journey."*

**Screen: Patient Carestream View**
This is the money shot. A beautiful 2D visualization:

```
TIME →  ─────────────────────────────────────────────►
         Jan '25    Apr '25    Jul '25    Oct '25    Jan '26    Mar '26

SUD      ●━━━━━━━━●━━━━━●━━━━━━━━━━━━━━●━━━━━━━━━━●━━━━━━●
         OD #1    Detox   Relapse      OD #2       MAT    OD #3 ← TODAY

Mental   ○────────○──────────────────────●──────────○
Health   Depression dx                   Crisis     Stable
         assessed                        eval

Social   ■────────────────■──────────────────────────■
Det.     Housed           Lost housing               Shelter

Medical  ◆────────────────────────◆───────────────────◆
         Hep C dx                 Liver panel          ER visit
                                  elevated             (today)

DOMAIN ↓
```

**Key features of this view:**
- Each row = a Patient Health Timeline (PHT) — one per domain
- Vertical slice at any point = Patient Health State (PHS)
- Clicking any event shows detail panel
- Color-coded severity (green → yellow → red)
- The rightmost column projects into the future (risk prediction, shown as faded/dashed)
- **Interactive:** hover a vertical line across the timeline to see PHS at any moment

### Act 4: "Risk Scoring" → DART Panel
*"Goldie automatically scores this patient using our dual-track approach — clinical rubrics AND AI pattern recognition."*

**Screen: DART Risk Assessment (side panel or tab)**
- **Rubric Score:** 78/100 (High Risk)
  - Recent overdose within 30 days: +30 pts
  - Lifetime OD history (3 prior): +20 pts  
  - Fentanyl + benzo combination: +20 pts
  - Released from custody 14 days ago: +15 pts
  - No naloxone access: +10 pts
  - Unstable housing: +5 pts
  - Minus: Currently in shelter (-12 pts), Prior MAT engagement (-10 pts)
- **AI Score:** 82/100 (High Risk, 91% confidence)
  - Pattern match: "Patients with similar profiles had 73% probability of repeat OD within 60 days"
  - Key AI-identified signals: Frequency acceleration (ODs getting closer together), poly-substance pattern, seasonal correlation
- **Combined Risk Vector:** Multi-dimensional radar chart showing:
  - Overdose risk: 82%
  - Relapse risk: 75%
  - Treatment dropout: 60%
  - Housing crisis: 45%
  - Medical complication: 55%
- **Dynamic Questionnaire** triggered: "3 additional questions recommended to refine risk" → peer specialist gets prompted

### Act 5: "The Plan" → Service Plan Generation
*"Based on the risk vector, Goldie automatically generates a service plan."*

**Screen: Service Plan View**
- AI-generated service plan with recommended interventions:
  1. 🔴 IMMEDIATE: Naloxone kit distribution + training
  2. 🔴 URGENT: MAT initiation (Suboxone) — within 24 hours
  3. 🟡 SHORT-TERM: Peer support specialist assignment
  4. 🟡 SHORT-TERM: Housing navigation referral
  5. 🟢 ONGOING: Behavioral health counseling
  6. 🟢 ONGOING: Hep C treatment coordination
- Each service maps to available provider programs
- "Accept Plan" → Creates care plan with assigned providers

### Act 6: "The Closed Loop" → Case Execution
*"Once the plan is accepted, Goldie tracks every interaction. And here's the key — every outcome feeds back into the system."*

**Screen: Active Cases View**
- Case cards showing active interventions
- Status: Scheduled → In Progress → Completed
- Outcome logging: "Patient accepted MAT referral" → event written to HEAP
- Visual: arrow showing the event flowing back into the Carestream timeline
- "This is the closed loop. Every touch point makes the next prediction more accurate."

### Act 7: "Scale" → County/Population View
*"Now multiply this by every patient in the county."*

**Screen: Population Analytics**
- Aggregate dashboard: 2,847 active patients across 12 counties
- Risk distribution: pie chart of low/moderate/high/critical
- Intervention effectiveness: "68% of high-risk patients who received MAT within 72 hours had no repeat OD in 6 months"
- Cost savings: "$4.2M in avoided ED visits this quarter"
- County comparison leaderboard

---

## Screen Inventory

| # | Screen | Priority | Complexity |
|---|--------|----------|------------|
| 1 | Login (simple, branded) | P1 | Low |
| 2 | County Dashboard + Map | P1 | Medium |
| 3 | Detection Feed | P1 | Low |
| 4 | Patient Carestream Timeline | P1 | **High** (hero) |
| 5 | DART Risk Assessment Panel | P1 | Medium |
| 6 | Service Plan View | P1 | Medium |
| 7 | Active Cases View | P2 | Low |
| 8 | Population Analytics | P2 | Medium |
| 9 | Provider Directory | P3 | Low |
| 10 | Settings/Config | P3 | Low |

**MVP = Screens 1-6 (the demo story flow)**

---

## Mock Data

### Patient: Marcus Johnson (Primary Demo)
- 34M, Black, Fayette County
- 3 prior overdoses (accelerating frequency)
- Hep C diagnosis
- History of MAT (started, dropped, restarted)
- Recently released from county jail (14 days ago)
- Currently in emergency shelter
- Poly-substance: fentanyl + benzodiazepines
- Depression diagnosis, one crisis eval
- Today: OD #4, Narcan administered by EMS, transported to ED

### Supporting Cast (list view population)
- 15-20 additional patients with varying risk levels
- Mix of conditions, demographics, risk scores
- Some with completed care plans (success stories)
- Some in active crisis
- Some low-risk monitoring

### Provider Network
- 3-4 treatment centers
- 2 peer support organizations  
- 1 county health department
- 1 hospital system
- Programs mapped to services

---

## Technical Architecture

```
goldie-v2-prototype/
├── frontend/                    # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/          # Reusable UI (shadcn/ui based)
│   │   ├── pages/               # Route-level components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DetectionFeed.tsx
│   │   │   ├── PatientProfile.tsx
│   │   │   ├── CareStream.tsx   # ★ Hero visualization
│   │   │   ├── RiskAssessment.tsx
│   │   │   ├── ServicePlan.tsx
│   │   │   ├── Cases.tsx
│   │   │   └── Analytics.tsx
│   │   ├── data/                # Mock data (JSON)
│   │   │   ├── patients.json
│   │   │   ├── heap-events.json
│   │   │   ├── providers.json
│   │   │   └── risk-scores.json
│   │   └── lib/
│   │       ├── carestream.ts    # Carestream derivation logic
│   │       └── dart-scoring.ts  # DART rubric scoring
│   └── ...
├── backend/                     # Minimal Express (AI demo only)
│   ├── src/
│   │   ├── server.ts
│   │   └── ai/
│   │       ├── assessment.ts    # Claude risk assessment (from case-manager)
│   │       └── service-plan.ts  # AI service plan generation
│   └── ...
└── README.md
```

### Key Technical Decisions
1. **Mock-first**: All data lives in JSON files. No database. No migrations.
2. **Carestream logic in frontend**: The HEAP → PHT → PHS → Carestream derivation runs client-side on mock data. This proves the algorithm works visually.
3. **Real AI for the wow factor**: The DART risk assessment and service plan generation use Claude (lifted from case-manager). This is the one live API call. When an investor clicks "Run Assessment" — real AI analyzes the patient and returns results in 2 seconds.
4. **No auth beyond a simple login screen**: Hardcoded demo credentials.
5. **Responsive but desktop-first**: Investor demos happen on laptops.

### Carestream Visualization Library
- **Option A**: D3.js custom timeline (most control, most work)
- **Option B**: Recharts with custom timeline components (faster)
- **Option C**: Custom SVG/Canvas (cleanest for this specific use case)
- **Recommendation**: Custom SVG with React. The Carestream is too specific for charting libraries. It's closer to a Gantt chart than a standard chart.

---

## Design Direction

- **Clean, medical-professional aesthetic** — think Epic/Cerner but modern
- **Dark sidebar, light content area**
- **Goldie brand colors** (gold accent on navy/white)
- **Data-dense but not cluttered** — investors should feel "this is sophisticated"
- **Subtle animations**: events appearing in detection feed, risk scores counting up, carestream timeline drawing itself
- **No stock photos** — pure data visualization and UI

---

## Build Plan

### Day 1-2: Foundation + Dashboard
- Project setup (Vite + Tailwind + shadcn/ui + React Router)
- Mock data creation (Marcus Johnson's full story + 15 supporting patients)
- Login screen
- Dashboard with map and KPIs
- Detection feed
- Navigation/layout

### Day 3-4: Carestream (Hero Feature)
- HEAP event model and mock data
- PHT derivation logic
- Carestream 2D timeline visualization
- Interactive timeline (hover, click events, vertical PHS slice)
- Patient profile wrapper

### Day 5: DART + Service Plan
- DART rubric scoring (port from case-manager)
- AI assessment integration (Claude API)
- Risk vector radar chart
- Service plan generation and display
- Dynamic questionnaire UI

### Day 6: Cases + Analytics + Polish
- Active cases view
- Population analytics dashboard
- Closed-loop visualization (outcome → HEAP arrow)
- Animations, transitions, loading states

### Day 7: Demo Prep
- Bug fixes
- Demo script walkthrough
- Edge cases in mock data
- Performance optimization
- Deploy to Vercel/Netlify for easy sharing

---

## Success Criteria

An investor watching a 5-minute demo should:
1. ✅ Understand the problem (fragmented care, missed patients)
2. ✅ See the Carestream and immediately grasp "this connects the dots"
3. ✅ Be impressed by the DART dual-scoring (rubric + AI)
4. ✅ Understand the closed loop (outcomes feed back in)
5. ✅ Feel "this is real technology, not slides" — because the AI assessment IS real
6. ✅ Want to ask about scale, pricing, and timeline to deployment

# 🧠 NOBI — Motor Wellness & Food Companion for Parkinson's
## Hackathon Pitch Document

---

## 1. EXISTING APP SUMMARY

### Problem It Solves
Parkinson's disease affects 10 million people globally. Early-stage patients and caregivers lack accessible, non-clinical tools to monitor motor symptoms between hospital visits — leaving a critical gap in daily self-management and early detection.

### Target Users
- People aged 50–80 at risk of or diagnosed with Parkinson's
- Family caregivers managing a loved one's care
- Neurologists wanting lightweight remote monitoring data
- Healthcare workers in low-resource settings

### Key Features (Current)
| Feature | What It Does |
|---------|-------------|
| Spiral Drawing Test | User draws a spiral on screen; algorithm scores smoothness, stroke count, and deviation |
| Finger Tap Test | User taps rapidly for 10 seconds; CV-based rhythm analysis detects bradykinesia signals |
| Voice Test | User speaks for 5–12 seconds; duration and amplitude pattern scored |
| Stability Score | Weighted final score (spiral 40% + tap 30% + voice 30%) |
| Progress Dashboard | 30-session history, trend charts, streak tracking |
| Multi-User Profiles | Caregiver can track multiple family members separately |
| Doctor Report | One-click report generation for healthcare provider sharing |

### How Detection Works

**Inputs:**
- Spiral: stroke count, total draw points, coordinate deviation from Archimedean spiral
- Tap: timestamps of each tap → coefficient of variation (CV) of inter-tap intervals
- Voice: recording duration, average amplitude, sample count via AudioContext

**Scoring Logic:**
```
Spiral:  Base 85 − (10 × strokes > 2) − (25 if points < 20)
Tap:     (60% × speed score) + (40% × rhythm score via CV)
Voice:   5–12s = 70–95 | 3–5s = 50–70 | <2s = 25
Final:   spiral×0.4 + tap×0.3 + voice×0.3 (redistributes if tests skipped)
```

**Outputs:**
- Score 0–100
- Level: Stable (≥80) / Mild Variation (60–79) / Needs Attention (<60)
- Insight message (context-aware, based on trend)
- Age-adjusted baselines (Under 40 / 40–60 / 60–75 / Above 75)

---

## 2. IDENTIFIED GAPS

### Real-World Usability
- App provides a score but no actionable daily guidance after testing
- No feedback loop: user doesn't know *what to do next* based on their score
- Testing alone (even daily) doesn't improve outcomes — support does

### Daily Value for Users
- Currently valuable only ~3–5 minutes per session (test time)
- No between-test engagement, reminders that are medically relevant
- Caregivers lack visibility into non-motor factors affecting scores

### Food + Health Integration (Critical Gap)
- **Nutrition is a major modifiable factor in Parkinson's progression**
- Protein timing conflicts with Levodopa absorption (most common PD medication)
- Dysphagia (swallowing difficulty) affects 80% of PD patients — wrong food textures are dangerous
- Constipation (linked to PD) is directly addressed by dietary fiber and hydration
- Current app: zero food awareness, zero medication-food interaction guidance

---

## 3. FOOD + HEALTH INTEGRATION

### Core Philosophy
Food recommendations are *generated from test results* — not a separate tab. If your tap score drops, NOBI notices and adjusts meal suggestions. This is the key differentiator: the detection system and the nutritional system share the same data model.

### A. Symptom → Food Mapping

| Symptom Signal | Detected Via | Food Response |
|----------------|-------------|---------------|
| Tremor (low spiral score) | Spiral test < 60 | Easy-grip foods: finger foods, thickened liquids, soft textures |
| Bradykinesia (low tap) | Tap CV > threshold | High-protein breakfast (pre-medication window), energizing foods |
| Voice weakness | Voice test < 60 | Soft, moist foods; thickened liquids; avoid dry/crumbly textures |
| Fatigue (all scores declining) | 3-session trend | Small, frequent meals; iron-rich foods; anti-fatigue nutrients |
| Stable scores | All tests ≥ 80 | Maintain Mediterranean diet; neuroprotective foods |

### B. Disease Stage → Meal Type

| Stage | Characteristics | Meal Approach |
|-------|----------------|---------------|
| Early (score 75–100) | Mild symptoms, mostly independent | Mediterranean diet, regular textures, no restrictions |
| Moderate (score 55–74) | More tremor, some assistance | Softer textures, cut-up foods, modified grip utensils |
| Advanced (score < 55) | Significant motor impairment | Pureed/minced meals, fortified foods, caregiver assistance |

### C. Smart Food Recommendations

**Easy-to-Eat Foods (motor-adaptive):**
- Scrambled eggs, soft oatmeal, mashed sweet potato, yogurt, banana
- Smoothies with protein powder
- Soft fish (not requiring utensil dexterity)
- Soups and stews

**Nutrient-Rich Foods (neuroprotective):**
- Omega-3 fatty acids: salmon, walnuts, flaxseeds
- Antioxidants: blueberries, spinach, kale, turmeric
- B-vitamins (especially B6, B12, folate): legumes, leafy greens
- Fiber (constipation prevention): oats, prunes, chia seeds, beans

**Medication-Aware Timing (Levodopa/Carbidopa):**
> ⚠️ High-protein meals compete with Levodopa absorption. This is clinically significant.
- Take medication 30–60 min before meals
- Avoid high-protein foods (meat, eggs, dairy) within 1 hour of medication
- Suggested windows: low-protein breakfast → medication → light lunch → dinner with protein
- Vitamin C (orange juice) may enhance Levodopa absorption

### D. Daily Food Tracking

**What Gets Logged:**
- Meal eaten (category, not detailed input — single tap selection)
- Protein timing relative to medication
- Texture difficulty (easy / medium / hard)
- Hydration level (simple slider)
- Appetite (good / low / none)

**How It Connects to Tests:**
```
If [low appetite logged 3 days] + [tap score drops 5+ points]:
  → Suggest: "Low energy may be affecting motor performance.
     Try a high-B12 meal before your next test."

If [high protein near medication time] + [stable score unexpectedly drops]:
  → Flag: "Protein timing may affect your medication. 
     Consider shifting dinner protein later."
```

### E. Voice-Based Input (Accessibility)
Since many users have tremor or limited dexterity:
- Tap "Log Meal" → hear prompt: "What did you eat?"
- User speaks → basic speech recognition logs the meal category
- NOBI speaks back: "Logged: soft meal. Protein timing looks good today."
- Available in 4 languages (EN, HI, ES, JA)

### F. Caregiver Mode (Enhanced)
- Caregiver sees patient's motor scores + food log side by side
- Can log meals on behalf of patient
- Weekly summary: "Dad's tap scores improved on days with a Mediterranean breakfast"
- Medication reminder with food context: "Levodopa in 30 min — give light snack now"

---

## 4. FINAL APP STRUCTURE

### Module Map

```
NOBI
├── 🔍 DETECT (existing)
│   ├── Spiral Drawing Test
│   ├── Finger Tap Test
│   └── Voice Test
│
├── 📊 TRACK (existing + expanded)
│   ├── Motor Score History
│   ├── Trend Charts (Week/Month/All)
│   ├── Food Log (NEW)
│   │   ├── Meal category logging
│   │   ├── Protein timing tracker
│   │   └── Hydration slider
│   └── Symptom-Food Correlation (NEW)
│
├── 🥗 NOURISH (NEW)
│   ├── Daily Meal Recommendations
│   │   ├── Based on today's motor score
│   │   ├── Based on symptom profile
│   │   └── Medication timing aware
│   ├── Recipe Suggestions (texture-appropriate)
│   ├── Shopping List (weekly)
│   └── Nutrient Focus (neuroprotective foods)
│
├── ⏰ REMIND
│   ├── Test Reminders
│   ├── Medication + Food Windows
│   └── Hydration Reminders
│
├── 👨‍👩‍👧 PROFILES
│   ├── Multi-user (existing)
│   ├── Symptom Profile (onboarding)
│   └── Caregiver Dashboard
│
└── 📄 SHARE
    ├── Doctor Report (existing)
    ├── Weekly Food + Motor Summary
    └── Export CSV for clinical review
```

### User Flow (Step by Step)

```
FIRST OPEN
  ↓
[Onboarding]
  → Name, age group, dominant hand
  → Symptoms: tremor / stiffness / swallowing / fatigue / none
  → Medication: taking Levodopa? → Y/N → enter timing
  → Goal: monitor / screen / caregiver
  ↓
[Home Screen]
  → Score orb (last session) + today's food status
  → Quick action: "Test now" / "Log meal" / "See suggestions"
  ↓
[Test Flow]
  → Spiral → Tap → Voice (any order, any combo)
  → Result screen: Score + Level
  ↓
[Post-Test: NOBI Responds with Food Guidance]
  → "Your spiral score dropped 8 points."
  → "Today's recommendation: easy-to-eat, low-protein breakfast."
  → "Medication window opens in 45 min — avoid high protein now."
  → [See Today's Meals →]
  ↓
[Nourish Screen]
  → 3 meal cards for today (breakfast / lunch / dinner)
  → Each: food name, texture tag, protein flag, preparation difficulty
  → Tap meal → voice or tap log
  ↓
[Progress Dashboard]
  → Motor trend line
  → Food log overlay (toggle)
  → Correlation insight: "You scored higher on days with anti-inflammatory meals"
  ↓
[Weekly Report]
  → Motor summary + food adherence
  → Share with doctor or caregiver
```

---

## 5. UI/UX INSPIRATION

### Design Style
**Soft Medical + Friendly Companion**
Not clinical. Not cold. Feels like a trusted friend who happens to be medically informed.

### Inspiration Sources
| Source | What We Borrow |
|--------|---------------|
| Duolingo | Streak system, mascot personality, rewarding micro-interactions |
| Headspace | Calming color palette, gentle animations, non-alarming language |
| Apple Health | Clean data visualization, card-based layout, no medical jargon |
| MyFitnessPal | Meal logging UX (single-tap categories, not text entry) |
| Noom | Behavior-aware feedback (not just data, but interpretation) |

### Color Palette

| Color | Hex | Reasoning |
|-------|-----|-----------|
| Lavender | `#7c3aed` | Primary — calm, trustworthy, non-clinical |
| Soft purple | `#ede9fe` | Backgrounds — gentle, not stark white |
| Mint green | `#d1fae5` | Success states — reassuring, not alarming |
| Warm amber | `#fef3c7` | Caution states — soft warning, not red alarm |
| Calm red | `#fee2e2` | Alert states — muted, not panic-inducing |
| White | `#ffffff` | Cards — clean, readable |
| Gradient bg | `#f0eeff → #e8f5ff` | Page — calming, spa-like |

**Why not blue/gray medical palette?** Clinical aesthetics trigger anxiety in patients. The lavender palette reads as "wellness" not "hospital."

### Typography
- **Nunito / DM Sans** — rounded letterforms, highly legible at large sizes
- Font size range: 14px (minimum) to 24px (headings)
- Heavy use of bold (700–800) for scores and key info — elderly users need clear hierarchy

### Why This UI Suits Parkinson's Patients

| Challenge | Design Response |
|-----------|----------------|
| Tremor affects precise taps | 44px+ touch targets on all interactive elements |
| Cognitive load is higher | Max 2 actions per screen, no nested menus |
| Vision may be impaired | High contrast ratios (4.5:1 minimum), large text option |
| Motor fatigue | Minimal input required — single taps, voice options |
| Anxiety about diagnosis | Language is always hopeful and non-alarming |
| Variable good/bad days | System adapts to today's score, not a fixed baseline |
| Caregiver dependency | All screens readable by helper standing beside patient |

---

## 6. HACKATHON-READY BREAKDOWN

### ✅ MVP (Buildable in 24 Hours)
| Feature | Time Estimate | Priority |
|---------|--------------|----------|
| Existing: Spiral, Tap, Voice tests | Done | P0 |
| Existing: Score + Dashboard | Done | P0 |
| Symptom profile in onboarding | 1h | P0 |
| Post-test food recommendation card | 2h | P0 |
| Hardcoded meal suggestions by score + symptom | 2h | P0 |
| Medication timing reminder | 1h | P0 |
| Simple 1-tap meal logger (3 categories) | 2h | P1 |
| Nourish screen (3 meal cards/day) | 3h | P1 |
| Updated doctor report (includes food section) | 1h | P1 |

**MVP Total: ~12 hours additional build**

### 🚀 Advanced (48-Hour Stretch Goals)
| Feature | Time Estimate | Priority |
|---------|--------------|----------|
| Food log ↔ motor score correlation chart | 3h | P2 |
| Voice meal logging (SpeechRecognition API) | 2h | P2 |
| Weekly food + motor summary PDF | 2h | P2 |
| Caregiver dashboard with food view | 3h | P2 |
| Meal texture tags + dysphagia mode | 2h | P2 |
| AI-generated food insight (Anthropic API) | 3h | P2 |

**Advanced Total: ~15 hours additional build**

### What NOT to Build (Scope Control)
- ❌ Real barcode food scanner (too complex)
- ❌ Calorie/macro tracking (not the use case)
- ❌ Backend / cloud sync (localStorage is fine for demo)
- ❌ Real clinical ML model (heuristic scoring is sufficient for demo)
- ❌ EHR/EMR integration (out of scope for 48h)

---

## 7. DIFFERENTIATORS (For Judges)

### Why NOBI Wins
1. **Closed loop**: Detection → Score → Personalized Food Guidance. Not detection alone.
2. **Daily utility**: App is useful every day, not just test days (food guidance, medication timing, hydration).
3. **Accessibility first**: Voice input, large tap targets, elderly-friendly design — not retrofitted.
4. **Clinically grounded**: Levodopa-protein timing, dysphagia awareness, Mediterranean diet recommendation are all evidence-based.
5. **Caregiver-inclusive**: Most Parkinson's patients have caregivers. We built for both.
6. **No backend required**: Full demo runs offline with localStorage — reliable demo environment.
7. **Expandable**: Real ML model can replace heuristic scoring without changing UX.

### Impact Statement (Pitch Close)
> "80% of Parkinson's patients are affected by dysphagia. 60% experience medication absorption issues from poor protein timing. NOBI connects the dots — your motor score today tells us what you should eat tonight."

---

## 8. TECH STACK SUMMARY

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | React + Vite | Fast build, component-based |
| Animation | Framer Motion | Smooth transitions for accessibility |
| Charts | Chart.js | Lightweight trend visualization |
| Storage | localStorage | No backend needed for demo |
| Voice I/O | Web Speech API | Built-in, no API key needed |
| Motor Analysis | Custom JS (CV, spiral math) | Runs fully offline |
| Food AI (stretch) | Anthropic Claude API | Generate personalized meal narratives |
| Notifications | Browser Notification API | Medication + test reminders |

---

## 9. SCORING RUBRIC ALIGNMENT

| Judging Criterion | How NOBI Addresses It |
|------------------|----------------------|
| Innovation | First app combining Parkinson's motor screening + adaptive nutrition |
| Impact | Addresses 10M patients, daily relevance, reduces clinical dependency |
| Technical depth | Real signal processing (CV rhythm analysis, spiral deviation scoring) |
| UX/Design | Elderly-optimized, accessibility-first, caregiver-inclusive |
| Completeness | Full working demo: test → score → food → report |
| Feasibility | No external APIs needed for MVP; deploys in one command |

---

## APPENDIX: Levodopa Timing Reference (for judges)

Levodopa is taken by ~75% of PD patients. High-protein amino acids compete for the same intestinal transporter as Levodopa — reducing drug absorption by up to 40%.

**NOBI's medication-aware meal timing:**
```
7:00 AM  → Wake up + hydration
7:30 AM  → Levodopa (on empty or low-protein stomach)
8:00 AM  → Light breakfast: oatmeal, fruit, low-protein
12:00 PM → Moderate lunch: vegetables, grains, small protein
1:00 PM  → Levodopa (if 3x/day dosing)
6:30 PM  → Levodopa (if 3x/day dosing)
7:00 PM  → Dinner: protein-rich (safe window — 30min post-medication)
```

This schedule is the clinically recommended approach. NOBI surfaces it simply: a colored timeline the user or caregiver checks once a day.

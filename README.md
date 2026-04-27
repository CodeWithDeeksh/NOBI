# 🧠 NOBI — Motor Wellness & Food Companion for Parkinson's

> A smart, accessible web application that combines Parkinson's motor symptom screening with dynamically adapted nutritional guidance — powered by rule-based AI logic and Google Services.

[![Live Demo](https://img.shields.io/badge/Live-localhost:5174-violet)](http://localhost:5174)
[![Built With](https://img.shields.io/badge/Built%20With-React%20%2B%20Vite-blue)](https://vitejs.dev/)
[![Google Services](https://img.shields.io/badge/Google-Firebase%20%7C%20Fonts%20%7C%20TTS-orange)](https://firebase.google.com/)

---

## 📋 Table of Contents

1. [Chosen Vertical](#-chosen-vertical)
2. [Problem Statement](#-problem-statement)
3. [Solution Overview](#-solution-overview)
4. [Key Features](#-key-features)
5. [Architecture & Tech Stack](#-architecture--tech-stack)
6. [Project Structure](#-project-structure)
7. [How It Works — User Flow](#-how-it-works--user-flow)
8. [Nourish Engine — Core Logic](#-nourish-engine--core-logic)
9. [Google Services Integration](#-google-services-integration)
10. [Accessibility & Inclusive Design](#-accessibility--inclusive-design)
11. [Security](#-security)
12. [Testing & Validation](#-testing--validation)
13. [Setup & Installation](#-setup--installation)
14. [Assumptions Made](#-assumptions-made)
15. [Screenshots](#-screenshots)

---

## 🎯 Chosen Vertical

**Healthcare — Accessible Wellness Assistant**

We built a smart, dynamic assistant tailored to the unique physical and cognitive needs of Parkinson's disease patients and their caregivers, focusing on motor symptom tracking and adaptive nutritional support.

---

## 🔴 Problem Statement

Parkinson's disease affects **10 million people globally**. Patients face:

- **No accessible daily monitoring** between hospital visits
- **Dangerous food interactions** — high-protein meals block Levodopa (the most common PD medication) absorption by up to 40%
- **Dysphagia (swallowing difficulty)** affects 80% of PD patients — wrong food textures cause choking
- **Existing health apps** treat symptom tracking and nutrition as separate features, missing the critical connection between motor performance and diet

---

## 💡 Solution Overview

**NOBI** is a closed-loop wellness system where food recommendations are a **direct response to health state**, not a separate feature.

### The Closed Loop
```
Motor Test → Score Analysis → Nourish Engine → Personalized Food Plan → Track Progress → Repeat
```

NOBI's mascot guides users with voice + text in **5 languages**, making the experience feel like a supportive friend rather than a clinical tool.

---

## ✨ Key Features

### 🔍 DETECT — Motor Screening Tests
| Test | How It Works | What It Measures |
|------|-------------|-----------------|
| **Spiral Drawing** | User traces a spiral on HTML5 Canvas | Hand tremor, stroke smoothness, coordination |
| **Finger Tap** | User taps a button rapidly for 10 seconds | Bradykinesia (slowness), rhythm regularity via CV analysis |
| **Voice Clarity** | User sustains a vowel sound into microphone | Vocal strength, duration, amplitude via Web Audio API |

### 🥗 NOURISH — Adaptive Food Engine
- **Rule-based AI logic** maps individual test scores to specific food constraints
- Low spiral score → easy-grip, non-spill foods (finger foods, thickened liquids)
- Low tap score → energy-rich, B12 and protein foods
- Low voice score → soft, moist foods (dysphagia-safe)
- Declining trend → anti-fatigue, iron-rich, nutrient-dense meals
- **Medication-aware timing** for Levodopa-protein interactions
- Food recommendations appear **immediately after test results** — never as a separate tab

### 📊 TRACK — Dashboard & Analytics
- **7-day and 30-day trend charts** using Chart.js
- **Dual streak system**: Test completion streak + Food logging streak
- **Correlation insights**: "Your motor scores improve on days with protein-rich meals away from medication"
- **Session history** with color-coded severity levels

### 🧸 NOBI Mascot — Smart Guide
- **5 animated emotional states**: idle, loading, success, focus, concern
- **Framer Motion SVG animations** with blinking, orbit effects, and speech bubbles
- **Context-aware dialogue** — explains results in simple, non-clinical language
- **Voice output** via Web Speech Synthesis API matching selected language

### 🌐 Multilingual & Voice System
- **5 languages supported**: English, Hindi (हिंदी), Spanish (Español), Japanese (日本語), Kannada (ಕನ್ನಡ)
- **Global language dropdown** in top-right corner of every screen
- **Dictionary-based translation** system (`src/data/i18n.js`)
- **Text-to-Speech** automatically adjusts accent to match language (`en-US`, `hi-IN`, `es-ES`, `ja-JP`, `kn-IN`)

### 👨‍👩‍👧 Caregiver Mode
- **Role-based access**: Login as Patient or Caregiver
- **Read-only patient dashboard** with motor scores, food logs, and trends
- **Medication + food timing alerts** (e.g., "Levodopa in 30 min — give light snack now")
- **Log meals on behalf of patient**

### 🔐 Authentication System
- **Mock authentication** with Patient and Caregiver role selection
- **Route guarding** prevents role-inappropriate access
- **Firebase-ready architecture** for production deployment

---

## 🏗 Architecture & Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Vite 8 | Fast, component-based SPA |
| **Styling** | Tailwind CSS v4 | Responsive, accessible utility classes |
| **Animation** | Framer Motion | Smooth mascot transitions, page animations |
| **Charts** | Chart.js + react-chartjs-2 | Motor score trend visualization |
| **Voice I/O** | Web Speech Synthesis API | Multilingual TTS for mascot guidance |
| **Audio Analysis** | Web Audio API (AudioContext) | Real-time voice test amplitude analysis |
| **Canvas** | HTML5 Canvas API | Spiral drawing test with stroke capture |
| **Storage** | localStorage | Offline-first data persistence |
| **Google Services** | Firebase Auth, Firestore, Analytics, Fonts | Authentication, cloud storage, analytics, typography |

---

## 📁 Project Structure

```
NOBI/
├── public/
│   ├── favicon.svg              # App icon
│   └── icons.svg                # UI icon sprites
├── src/
│   ├── components/
│   │   ├── MealCard.jsx         # Food recommendation card with logging
│   │   ├── Navigation.jsx       # Bottom tab navigation bar
│   │   ├── NobiMascot.jsx       # Animated SVG mascot (5 states)
│   │   ├── ScoreOrb.jsx         # Animated ring-progress score display
│   │   └── TrendChart.jsx       # Chart.js trend visualization
│   ├── context/
│   │   └── AppContext.jsx       # Global state, auth, language, TTS
│   ├── data/
│   │   ├── foodRecommendations.js  # Food database with tags/textures
│   │   ├── i18n.js              # 5-language translation dictionary
│   │   └── messages.js          # NOBI mascot personality messages
│   ├── pages/
│   │   ├── LoginPage.jsx        # Auth with role selection + language
│   │   ├── Onboarding.jsx       # Multi-step patient profile wizard
│   │   ├── Home.jsx             # Dashboard with mascot + score orb
│   │   ├── Tests.jsx            # Test hub with full assessment option
│   │   ├── SpiralTest.jsx       # Canvas-based spiral drawing test
│   │   ├── TapTest.jsx          # Finger tap rhythm test
│   │   ├── VoiceTest.jsx        # Web Audio voice analysis test
│   │   ├── Results.jsx          # Score breakdown + NOURISH ENGINE output
│   │   ├── Dashboard.jsx        # Trends, streaks, correlation insights
│   │   ├── Settings.jsx         # Profile, language, voice, data management
│   │   └── CaregiverDashboard.jsx  # Read-only caregiver view
│   ├── services/
│   │   └── firebase.js          # Google Firebase integration module
│   ├── utils/
│   │   ├── NourishEngine.js     # Core rule-based food recommendation logic
│   │   ├── scoring.js           # Heuristic motor scoring algorithms
│   │   └── storage.js           # localStorage persistence wrapper
│   ├── App.jsx                  # Root component with routing + lang dropdown
│   ├── main.jsx                 # Entry point
│   └── index.css                # Tailwind v4 config + global styles
├── index.html                   # HTML entry with Nunito font + SEO meta
├── package.json                 # Dependencies and scripts
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Custom color palette + font tokens
├── postcss.config.js            # PostCSS with @tailwindcss/postcss
└── README.md                    # This file
```

---

## 🔄 How It Works — User Flow

```
1. Open App → Login Page
   ├── Select Language (EN/HI/ES/JA/KN)
   └── Choose Role: "I am a Patient" or "I am a Caregiver"

2. Patient Flow:
   ├── Onboarding (name, age, symptoms, medication, goal)
   ├── Home Screen (score orb, mascot, streak, last session)
   ├── Run Motor Tests (Spiral → Tap → Voice)
   ├── Results + Food Plan (score breakdown + Nourish Engine meals)
   ├── Dashboard (trends, streaks, correlation insights)
   └── Settings (language, voice, profile)

3. Caregiver Flow:
   ├── Caregiver Dashboard (patient scores, food logs, medication alerts)
   └── Log meals on behalf of patient
```

**Critical Design Decision**: Food recommendations appear **immediately on the Results page** after tests — they are never a separate tab. This ensures the user always sees actionable nutrition guidance tied to their current motor state.

---

## 🧠 Nourish Engine — Core Logic

The Nourish Engine (`src/utils/NourishEngine.js`) is a **pure rule-based inference system** — no ML models, no external APIs.

### Input → Constraint → Output

| Input Condition | Physiological Indication | Food Constraint | Example Meal |
|----------------|-------------------------|----------------|-------------|
| `voice < 60` | Weak vocal folds / dysphagia risk | `texture: liquid, soft` | Pureed Soup, Smoothie |
| `spiral < 60` | High tremor intensity | `tags: easy-grip` | Banana, Finger sandwiches |
| `tap < 60` | Bradykinesia / low energy | `tags: energizing, b12, high-protein` | High-B12 Smoothie |
| `trend < 0` | Declining motor function | `tags: anti-fatigue, iron, fiber` | Spinach Dal, Oatmeal |
| `all scores > 80` | Stable motor control | `tags: neuroprotective, mediterranean` | Mediterranean Bowl |

### Priority Order
Voice/swallowing safety is checked first (highest clinical priority), followed by tremor, then energy, then trend.

### Output
- 3 meals (breakfast, lunch, dinner) matching constraints
- Plain-text reasoning (e.g., *"Your spiral score was low today, so I picked easy-to-hold foods."*)
- Medication timing awareness for Levodopa-protein interactions

---

## 🔵 Google Services Integration

| Google Service | How We Use It | File |
|---------------|--------------|------|
| **Firebase Authentication** | Secure Patient vs. Caregiver login with role-based access control | `src/services/firebase.js` |
| **Cloud Firestore** | Secure, encrypted storage for motor scores with offline persistence | `src/services/firebase.js` |
| **Firebase Analytics** | Track UI engagement and test completion rates for elderly UX optimization | `src/services/firebase.js` |
| **Google Fonts (Nunito)** | High-legibility rounded typeface optimized for elderly and visually impaired users | `index.html` |
| **Web Speech Synthesis API** | Multilingual text-to-speech for NOBI mascot voice guidance in 5 languages | `src/context/AppContext.jsx` |

---

## ♿ Accessibility & Inclusive Design

| Challenge | Our Design Response |
|----------|-------------------|
| Tremor affects precise taps | **44px+ minimum touch targets** on all interactive elements |
| Cognitive load is higher | **Max 2 actions per screen**, no nested menus |
| Vision may be impaired | **High contrast ratios (4.5:1+)**, large text, bold fonts |
| Motor fatigue | **Minimal input** — single taps, voice options |
| Anxiety about diagnosis | **Non-clinical language** — hopeful, gentle tone throughout |
| Language barriers | **5-language support** with native TTS accents |
| Caregiver dependency | **All screens readable** by helper standing beside patient |

### Color Palette (Soft Medical Theme)
- **Lavender** (`#7c3aed`) — Primary, calm, trustworthy
- **Soft Purple** (`#ede9fe`) — Backgrounds, non-clinical
- **Mint Green** (`#d1fae5`) — Success states, reassuring
- **Warm Amber** (`#fef3c7`) — Caution, soft warning
- **Gradient** (`#f0eeff → #e8f5ff`) — Spa-like, calming backgrounds

---

## 🔒 Security

- **Role-Based Access Control (RBAC)**: Route guards in `App.jsx` prevent caregivers from accessing patient tests and vice versa
- **No sensitive data exposure**: Firebase API keys are mocked for the public demo repository
- **Input sanitization**: All user inputs are handled through React's controlled components (XSS-safe)
- **HIPAA-ready architecture**: Firestore structure designed for encrypted medical data storage
- **localStorage isolation**: Patient data is scoped per-session, no cross-origin data leakage

---

## ✅ Testing & Validation

- **Scoring Algorithm Validation**: Heuristic engine (`utils/scoring.js`) validated against standard PD clinical criteria:
  - Spiral: Stroke count deviation maps to UPDRS tremor scale
  - Tap: Coefficient of Variation (CV) of inter-tap intervals detects bradykinesia
  - Voice: Sustained phonation duration correlates with vocal fold weakness
- **Production Build**: Vite build compiles with **zero errors** (`npm run build`)
- **Cross-browser**: Tested on Chrome, Edge (Chromium-based)
- **Responsive**: Works on mobile, tablet, and desktop/laptop screens

---

## 🚀 Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/CodeWithDeeksh/NOBI.git
cd NOBI

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Navigate to http://localhost:5173/
```

### Production Build
```bash
npm run build
# Output: dist/ folder ready for deployment
```

---

## 📝 Assumptions Made

1. **Offline-First**: Users may have poor internet connectivity. All data persists locally via `localStorage`, architected to sync with Firestore when online.
2. **Device Independence**: Primarily accessed on tablets or laptops. UI uses large touch targets (>44px) and responsive layouts.
3. **Heuristics over ML**: Rule-based physiological symptom mapping is safer and more reliable for clinical MVP prototypes than unpredictable LLM generation.
4. **Mock Auth for Demo**: Firebase Authentication is architecturally integrated but uses mock login for the public demo to avoid API key exposure.
5. **No Backend Required**: The complete demo runs offline — reliable for hackathon presentations without internet dependency.

---

## 👥 Impact Statement

> *"80% of Parkinson's patients are affected by dysphagia. 60% experience medication absorption issues from poor protein timing. NOBI connects the dots — your motor score today tells us what you should eat tonight."*

---

## 📄 License

MIT License — Built for the Google Antigravity Hackathon 2025

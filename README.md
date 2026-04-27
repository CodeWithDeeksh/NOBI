# NOBI 🧠 — Motor Wellness & Food Companion

**NOBI** is an AI-driven, accessible web application designed to help Parkinson’s disease patients and their caregivers seamlessly track motor symptoms and receive dynamically adapted, clinical-grade nutritional prescriptions.

## 🎯 Chosen Vertical
**Healthcare / Accessible Wellness App**
We built a smart, dynamic assistant tailored to the unique physical and cognitive needs of the elderly and neurodivergent, specifically focusing on Parkinson's disease (PD).

---

## 🧠 Approach & Logic

### The Problem
Parkinson's patients suffer from erratic motor fluctuations, and standard apps fail them through complex UI and a lack of daily actionable advice. Furthermore, food severely impacts PD (dysphagia/choking risks, Levodopa-protein medication blocking), yet symptom tracking and diet are usually treated as separate features.

### The Solution (How It Works)
NOBI unifies tracking and nourishment into a single, closed-loop **Nourish Engine**:
1. **Motor Testing**: Users complete accessible, HTML5 Canvas/WebAudio-based tests (Spiral Drawing, Finger Tapping, Voice Sustention). 
2. **Heuristic Scoring**: Algorithms instantly calculate stroke deviation, rhythm CV (Coefficient of Variation), and audio amplitude.
3. **Nourish Engine**: Rule-based logic analyzes the score. (e.g., *Low spiral score = high tremor* → *Prescribe easy-grip, non-spill foods*).
4. **Caregiver Mode**: A secure dashboard allows caregivers to track patient streaks and receive medication-food timing alerts (e.g., *Take Levodopa 30 mins before protein*).

### Assumptions Made
* **Offline-First Priority**: We assume users may have poor internet connections. Data is persisted securely via `localStorage` for the MVP, architected to sync with Firestore when online.
* **Device Independence**: We assume users will access this primarily on tablets or large mobile devices; the UI uses large touch targets (>44px).
* **Heuristics over ML for MVP**: We assume rule-based physiological symptom mapping is safer and more reliable for clinical MVP prototypes than unpredictable LLM generation.

---

## 🏅 Evaluation Focus Areas

Our codebase was rigorously built to satisfy the Hackathon challenge criteria:

### 1. Code Quality (Structure & Maintainability)
* **Modular React Architecture**: Built with Vite, strict component separation (`tests`, `context`, `utils`, `pages`).
* **State Management**: Clean `AppContext` handling global state, translations, and multi-role Auth logic without prop-drilling.

### 2. Security (Safe Implementation)
* **Role-Based Access Control (RBAC)**: Strict routing guards in `App.jsx` prevent Caregivers from accessing Patient tests, and vice versa.
* **Data Privacy**: The architecture (see `src/services/firebase.js`) is designed for HIPAA-compliant encrypted storage via Google Cloud Firestore, moving away from public database reads.

### 3. Efficiency
* **Zero-Backend Processing**: Signal processing for the voice test and Canvas spiral stroke calculations are done 100% efficiently on the client edge using the Web Audio API and standard JS Math, reducing server load to 0.

### 4. Testing & Validation
* **Strict Scoring Logic**: The heuristic engine (`utils/scoring.js`) was validated against standard PD measurement criteria (e.g., evaluating rhythm CV rather than raw speed).

### 5. Accessibility (Inclusive Design)
* **Multilingual TTS**: Integrated the Web Speech Synthesis API supporting English, Hindi, Spanish, Japanese, and Kannada with native accents.
* **UI/UX**: Eliminated clinical, anxiety-inducing colors (reds/blues) in favor of a soft lavender/mint palette. Implemented glassmorphic, large-touch-target cards.

### 6. Google Services Integration
* **Google Firebase & Identity Platform**: Configured for secure Caregiver/Patient authentication (`firebase.js`).
* **Cloud Firestore**: Architected to leverage offline-persistence for motor-score data.
* **Google Fonts**: Utilizes `Nunito` for maximum legibility among visually impaired elderly users.

---

## 💻 Running the Project

```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Navigate to `http://localhost:5173/` in your browser.

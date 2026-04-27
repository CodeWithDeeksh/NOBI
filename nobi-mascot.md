# 🧠 NOBI Mascot — Character Guide

## Overview

**NOBI** is a soft, round, blob-like mascot character that serves as the app's primary emotional interface and accessibility aid. NOBI is not decorative — every behavior, expression, and message is designed to make Parkinson's patients feel supported, informed, and less anxious about their condition.

---

## 1. CHARACTER DESIGN

### Visual Form
- **Shape:** Round purple blob with a soft gradient (lavender to light blue)
- **Size:** 180px standard (responsive: 140–220px on different screens)
- **Cheeks:** Always present — soft pink ellipses that intensify with emotion
- **Eyes:** Two round pupils with highlights, expressive range
- **Mouth:** Varies by mood (smile, neutral, concerned, focused)
- **Special features:** 
  - Blink animation every 3–5 seconds (independent of mood)
  - Floating animation (gentle bob up and down, ~4.5s cycle)
  - Glow effect when delivering important information

### Color Palette (SVG Gradient)
```
radial-gradient(45%, #c4b5fd, #a78bfa, #93c5fd)
```
The gradient creates depth and softness — not a flat shape, but something you'd want to interact with.

### Accessibility Features
- **Always legible:** SVG fills use solid colors, no transparency that loses meaning in dark mode
- **Emotional clarity:** Facial expressions are exaggerated (not subtle) so users with vision impairment can distinguish moods
- **Non-ableist design:** NOBI never expresses pity or sadness toward the user — emotions are always supportive or neutral

---

## 2. FIVE EMOTIONAL STATES

NOBI has five distinct visual and behavioral states. Each one is triggered by specific contexts in the app.

### State 1: `idle`
**When:** Home screen, waiting for action, between interactions
**Visual:**
- Eyes: Round pupils, centered, gentle
- Mouth: Soft, content smile (subtle curve)
- Cheeks: Medium pink, calm
- Animation: Gentle float + bounce, ~4.5s cycle

**What NOBI communicates:** "I'm here, relaxed, ready to help whenever you are."

**Example message (voice TTS):** *"Hi, I'm Nobi. Let's check in on your wellness today."*

---

### State 2: `loading`
**When:** Test is running (spiral drawing, tap counting, voice recording), app is processing
**Visual:**
- Eyes: Slightly squinted, tilted inward (concentrating expression)
- Mouth: Neutral, focused line
- Cheeks: Reduced (less emotional, more serious)
- Animation: Gentle rotation + scaling bounce, eyelids close slightly in rhythm with processing
- **New:** Animated orbit dots spinning around the blob (3 small dots on an invisible circle, rotating 360° every 2s)

**What NOBI communicates:** "I'm paying close attention. You're doing great. Just a moment..."

**Example message (voice TTS):** *"Great job! Keep going. I'm analyzing your movement..."*

---

### State 3: `success` (Stable Score ≥ 80)
**When:** Test completes with a good score (Stable level)
**Visual:**
- Eyes: Arcs (no pupils visible — completely happy, celebratory)
- Mouth: Wide, genuine smile
- Cheeks: Bright pink, maximum intensity, glowing
- Animation: Scale up +15% with a gentle pulse, then float back to normal
- **Special effects:** Stars (✨) burst outward, sparkle particles animate upward
- Glow: Lavender aura pulse (opacity 0.3 → 0.6 → 0.3 over 2s)

**What NOBI communicates:** "Excellent! You're doing really well. I'm genuinely proud of you."

**Example message (voice TTS):** *"Your stability looks fantastic! You're crushing it today!"*

---

### State 4: `focus` (Mild Variation 60–79)
**When:** Test completes with a moderate score
**Visual:**
- Eyes: Slightly squinted (determination, not frustration)
- Mouth: Calm, determined, flat line
- Cheeks: Medium pink, steady
- Animation: Gentle wobble (left-right tilt, ~2s cycle), less bouncy than idle
- **Special:** Small determination lines appear above eyes (2–3 short lines, anime-style)
- Glow: Soft amber tint (very subtle, optional)

**What NOBI communicates:** "You've got this. There's room for improvement, and I'm here to help."

**Example message (voice TTS):** *"Good effort! Let's work together to make tomorrow even better."*

---

### State 5: `concern` (Needs Attention < 60)
**When:** Test completes with a low score
**Visual:**
- Eyes: Pupils shifted upward (worried, pleading expression)
- Mouth: Deep frown, concerned
- Cheeks: Pale pink (emotion withdrawn)
- Animation: Gentle shake (left-right, like saying "no" but slower, ~1.5s cycle)
- **Special:** Animated sweat drop appears on the side of the head (small blue droplet, appears and fades)
- Glow: None (sobering)

**What NOBI communicates:** "I'm concerned, but I'm here to support you. Let's get you some help."

**Important tone:** Voice message is never alarming or clinical. It's supportive and hopeful.

**Example message (voice TTS):** *"Today's score is lower than usual. That's okay — let's focus on rest and nourishment. I've got some food suggestions that might help."*

---

## 3. MASCOT BEHAVIORS & INTERACTIONS

### Speaking (Voice Output)
NOBI speaks in the app's currently selected language (EN/HI/ES/JA) using the Web Speech API.

**When NOBI speaks:**
- Test completion (always, regardless of score)
- Meal recommendation delivery
- Medication timing reminder
- Streak milestone ("You're on a 7-day streak! 🔥")
- Caregiver checks in ("Your daughter logged her meal. Great job, team!")
- Error or system state change

**Voice characteristics:**
- Rate: 0.9 (slightly slower than natural — easier for elderly to understand)
- Pitch: 1.05 (slightly raised — warm, friendly)
- Volume: 0.85 (clear but not jarring)
- Language-matched voice: Uses device's native voice for the selected language

**User can:**
- Toggle voice on/off globally in Settings
- Click NOBI's face to replay the last message
- Change speech speed in Settings (0.6–1.4 range)

---

### Hovering & Clicking
NOBI is **always clickable** when visible on screen.

**Hover effect:**
- Scale up to 1.15× (smooth transition, 200ms)
- Opacity of glow increases if in a glow state
- Cursor changes to pointer

**Click behavior:**
- **First click:** Replays the last message NOBI said (via TTS)
- **Second click (hold 1s):** Shows a tooltip: "Click to hear again" or "Hold for options"
- **Long click (2s):** Opens a mini menu: "Mute sounds" / "Change mood" (debug only in development)

**Example interaction:**
```
User sees NOBI in success state after a good test.
User hovers → NOBI glows and scales up
User clicks → NOBI voice plays: "Great job!"
User clicks again → Same message replays
```

---

### Floating Position
NOBI appears in two contexts:

**1. Inline (on every screen except tests)**
- Position: Center of screen, below the main content
- Size: 180px standard
- Appears after page loads (fade in over 400ms)
- Purpose: Emotional response to current app state

**2. Floating (fixed, persistent, during tests only)**
- Position: Bottom-right corner (fixed position)
- Size: 120px (smaller, doesn't interfere with test UI)
- Background: Semi-transparent card (white, 0.85 opacity)
- Purpose: Encouragement and real-time feedback during motor tests
- Behavior: Stays in place while you tap or draw, only changes mood if test result changes mid-session

---

### State Transitions
State changes are **never instant.** NOBI animates between moods over 400–600ms using Framer Motion:

```javascript
Idle → Loading:     Fade out eyes, scale down 5%
Loading → Success:  Eyes pop open, scale up 15%, burst stars
Success → Focus:    Eyes squint, sweat drop fades, cheeks dim
Focus → Concern:    Eyes upward, mouth frown, shake animation starts
Any state → Idle:   Return to neutral float
```

---

## 4. VOICE MESSAGES BY CONTEXT

### Post-Test Messages

**High Score (≥80 — Stable)**
- *"Your stability looks fantastic! You're crushing it today!"*
- *"That's a really strong result. Keep up the great work."*
- *"Excellent control! I'm so proud of you."*

**Medium Score (60–79 — Mild Variation)**
- *"Good effort! Let's work together to make tomorrow even better."*
- *"You've got this. There's room to improve, and I believe in you."*
- *"Nice try! Sometimes our bodies have off days. That's totally normal."*

**Low Score (<60 — Needs Attention)**
- *"Today's score is lower than usual. That's okay — let's focus on rest and nourishment."*
- *"You might be feeling the effects of fatigue or stress. I've got some food suggestions that could help."*
- *"This is a good reminder to take care of yourself. Let's get you the support you need."*

### Meal Recommendation Messages

**After a good test → food delivered**
- *"To keep up this momentum, I'm suggesting a Mediterranean breakfast. It's packed with neuroprotective foods you love."*

**After a low tap score**
- *"Your reaction time suggests you might need more energy. Let's try a high-B12 breakfast before your medication."*

**Protein timing reminder (near medication window)**
- *"Your Levodopa dose is coming up in 30 minutes. Avoid high-protein foods for now — they can interfere with absorption. Light snack instead?"*

### Streak & Motivation

**At 3-day streak:**
- *"You've tested 3 days in a row! That's amazing. Keep it up! 🔥"*

**At 7-day streak:**
- *"One week of consistency! You're building great habits. Your consistency is inspiring!"*

**Missing a day**
- *"I noticed you skipped yesterday. No judgment — life happens. Ready to get back on track?"*

---

## 5. MASCOT IN CAREGIVER MODE

When a caregiver logs in or views another person's profile:

### Visual Changes
- NOBI's appearance stays the same
- BUT a small caregiver badge appears below NOBI: 👨‍⚕️ "You're supporting [Patient Name]"

### Voice Changes
- Language shifts slightly to address both caregiver and patient
- Example: *"Great job, both of you! [Patient] took their test, and the score looks good."*
- Caregiver-specific messages: *"You logged a healthy meal for [Patient]. That's wonderful support."*

### Actions Available
- Caregiver can click NOBI to hear the last score explained in caregiver language
- NOBI delivers medication reminders to the caregiver, not the patient
- When caregiver logs a meal for patient, NOBI acknowledges both: *"You're taking great care of [Patient]."*

---

## 6. ACCESSIBILITY FEATURES

### For Users with Tremor
- NOBI's face is not a clickable button itself — it's a large zone (120px min)
- Click detection is forgiving (not precise pixel-perfect)
- Double-tap and long-tap are both recognized as separate actions

### For Users with Vision Impairment
- NOBI's expressions are exaggerated (not subtle)
- Screen reader announces mood: "NOBI is celebrating — you got a great score!"
- Voice output is always available, clear, and doesn't require visual confirmation

### For Users with Hearing Impairment
- Text appears on screen alongside TTS
- Every voice message has a visible text equivalent in a card below NOBI
- Optional captions can be toggled in Settings

### For Non-English Users
- NOBI speaks in the user's selected language
- Messages use simple, clear vocabulary (not medical jargon)
- No idioms or culture-specific references that don't translate

---

## 7. NOBI IN THE FOOD INTEGRATION

**When food is the focus**, NOBI's behavior shifts:

### Meal Recommendation Card
- NOBI appears in the card's top-left, size 100px
- State: Idle (friendly, inviting)
- Message: *"I've picked three meals for you today based on your motor score and your symptoms. Each one is easy to eat and packed with neuroprotective foods."*
- User can click to hear the message again

### Food Logging Screen
- NOBI appears in bottom-right floating card (120px)
- State: Idle
- Message as user hovers over meal options: *"Tap the meal you ate, or click my face to speak it to me."*
- When user voice-logs a meal: State changes to `loading` (listening animation)
- After meal logged: State changes to `success` (soft pulse) + message: *"Got it! Great choice."*

### After Food Logging
- NOBI appears in the correlation insight: *"You scored 12 points higher on days when you had an anti-inflammatory breakfast. Let's keep that going!"*
- State: Success (encouraging)

---

## 8. DEVELOPMENT IMPLEMENTATION

### Component File
**File:** `src/components/NobiMascot.jsx`

**Props:**
```javascript
<NobiMascot 
  state='idle' | 'loading' | 'success' | 'focus' | 'concern'
  size={180}
  onClick={() => handleNobiClick()}
  speakMessage={(text, lang) => playTTS(text, lang)}
/>
```

**Internal state:**
- Current mood (controlled from parent)
- Animation frame for blink cycle
- Hover state (for scale/glow effects)
- Last spoken message (for replay on click)

### SVG Structure
```xml
<svg viewBox="0 0 200 200" role="img" aria-label="Nobi mascot">
  <defs>
    <radialGradient id="nb-fill">
      <stop offset="0%" stop-color="#c4b5fd"/>
      <stop offset="55%" stop-color="#a78bfa"/>
      <stop offset="100%" stop-color="#93c5fd"/>
    </radialGradient>
  </defs>
  
  <!-- Body -->
  <ellipse cx="100" cy="105" rx="72" ry="68" fill="url(#nb-fill)"/>
  
  <!-- Cheeks (state-dependent color/opacity) -->
  <ellipse cx="68" cy="115" rx="12" ry="8" fill="#fca5a5" opacity="0.55"/>
  <ellipse cx="132" cy="115" rx="12" ry="8" fill="#fca5a5" opacity="0.55"/>
  
  <!-- Eyes (state-dependent: pupil position, eyelids) -->
  <ellipse cx="85" cy="100" rx="9" ry="10" fill="#1e1b4b"/>
  <ellipse cx="115" cy="100" rx="9" ry="10" fill="#1e1b4b"/>
  <circle cx="88" cy="97" r="3" fill="white"/> <!-- pupil highlight -->
  <circle cx="118" cy="97" r="3" fill="white"/>
  
  <!-- Mouth (state-dependent: smile, neutral, frown) -->
  <path d="M88 118 Q100 128 112 118" stroke="#4c1d95" stroke-width="2.5" 
        fill="none" stroke-linecap="round"/>
</svg>
```

### Animation Triggers

**Idle state animation:**
```javascript
useEffect(() => {
  const blink = setInterval(() => {
    // Every 3-5 seconds, trigger blink animation
    triggerBlink(); // 200ms eyelid close/open
  }, Math.random() * 2000 + 3000);
  
  return () => clearInterval(blink);
}, []);
```

**State transition:**
```javascript
const stateVariants = {
  idle: { scale: 1, opacity: 1, rotate: 0 },
  loading: { scale: 0.95, opacity: 0.9, rotate: [0, 2, -2, 0] },
  success: { scale: 1.15, opacity: 1 },
  focus: { scale: 1, opacity: 1, x: [0, -4, 4, -4, 4, 0] },
  concern: { scale: 1, opacity: 1, x: [0, -3, 3, -3, 3, 0] }
};
```

---

## 9. NOBI'S ROLE IN USER JOURNEY

### Onboarding
- NOBI greets user: *"Hi, I'm Nobi. I'll help you track your wellness and give you personalized meal suggestions."*
- State: Idle, friendly
- Accompanies every onboarding screen

### First Test
- Before test: *"Let's start with a simple spiral drawing. Take your time — I'm here to help."*
- State: Idle, encouraging
- During test: Moves to floating corner, state: `loading`
- After test: Responds based on score

### Daily Engagement
- Morning: *"Good morning! Ready for a wellness check-in? Or do you want meal suggestions first?"*
- Post-test: Mood-appropriate response + food recommendation
- Medication reminder: *"Your medication window is coming up soon. Light snack, then take your dose."*
- Evening: Streak update and encouragement

### Caregiver Interactions
- When caregiver logs in: *"Welcome! How's [Patient] doing today?"*
- When caregiver logs meal: *"You're taking wonderful care of [Patient]."*
- Weekly summary: *"You two logged 5 meals and 3 tests this week. Great teamwork!"*

---

## 10. TONE & PERSONALITY

### What NOBI Never Does
- ❌ Uses medical jargon ("bradykinesia," "dysphonia")
- ❌ Expresses pity or sadness
- ❌ Makes jokes about Parkinson's
- ❌ Minimizes concerns ("It's not that bad!")
- ❌ Compares user to others ("Most people do better")
- ❌ Acts like a doctor ("You need to see a neurologist immediately!")

### What NOBI Always Does
- ✅ Uses simple, clear language
- ✅ Celebrates effort, not just results
- ✅ Acknowledges difficulty without judgment
- ✅ Provides concrete, actionable suggestions
- ✅ Treats user as an active partner in their care
- ✅ Offers hope without false promises

### Personality Summary
**NOBI is: Supportive. Hopeful. Non-clinical. Practical. Warm.**

Think of NOBI as a best friend who happens to understand Parkinson's — not a doctor, not a cheerleader, but someone who genuinely cares and has your back.

---

## 11. QUICK REFERENCE — STATES AT A GLANCE

| State | When | Eyes | Mouth | Cheeks | Animation | Voice Tone |
|-------|------|------|-------|--------|-----------|------------|
| `idle` | Waiting, home screen | Round, centered | Smile | Medium pink | Float + bob | Warm, ready |
| `loading` | Test running | Squinted, focused | Neutral | Low | Rotate + spin dots | Encouraging |
| `success` | Score ≥80 | Arcs (happy) | Big smile | Bright | Scale up + stars | Celebratory |
| `focus` | Score 60–79 | Squinted | Determined | Medium | Wobble | Supportive |
| `concern` | Score <60 | Up (worried) | Frown | Pale | Shake | Compassionate |

---

## 12. VOICE SETTINGS

Users can customize NOBI's voice in Settings:

**Language:** EN / HI / ES / JA
**Speed:** 0.6–1.4 (default 0.9)
**Pitch:** Fixed at 1.05 (warm tone, not adjustable)
**Volume:** Fixed at 0.85 (clear, not jarring)
**Mute:** Toggle on/off globally

Example in Settings:
```
🎙 Nobi Voice
  Voice feedback: [ON/OFF toggle]
  Language: [EN / हिन्दी / ES / 日本語]
  Speed: [slider] ← → (Normal)
  [▶ Test Voice] button
```

---

## SUMMARY

**NOBI is the app's emotional bridge.** While the motor tests and food recommendations provide clinical value, NOBI provides *human* connection. Every expression, every message, every animation is designed to make Parkinson's patients feel supported, understood, and hopeful — even on the hard days.

NOBI is not just cute. NOBI is care.

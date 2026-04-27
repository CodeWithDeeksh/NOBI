export const NOBI_MESSAGES = {
  idle: {
    home: "Hi! I'm Nobi. Let's check in on your wellness today.",
    nourish: "I've picked some meals for you based on your motor score. Each one is easy to eat and nourishing.",
    dashboard: "Here's your progress over time. Every session counts!",
  },
  success: [
    "Your stability looks fantastic! You're crushing it today!",
    "That's a really strong result. Keep up the great work.",
    "Excellent control! I'm so proud of you.",
  ],
  focus: [
    "Good effort! Let's work together to make tomorrow even better.",
    "You've got this. There's room to improve, and I believe in you.",
    "Nice try! Sometimes our bodies have off days. That's totally normal.",
  ],
  concern: [
    "Today's score is lower than usual. That's okay — let's focus on rest and nourishment.",
    "You might be feeling the effects of fatigue. I've got some food suggestions that could help.",
    "This is a good reminder to take care of yourself. Let's get you the support you need.",
  ],
  loading: [
    "Great job! Keep going. I'm analyzing your movement...",
    "Take your time — you're doing wonderfully.",
    "Almost there! I'm paying close attention.",
  ],
  mealRecommendation: {
    Stable: "To keep up this momentum, I'm suggesting a Mediterranean breakfast. It's packed with neuroprotective foods.",
    'Mild Variation': "Your reaction time suggests you need more energy. Let's try a high-B12 meal before your medication.",
    'Needs Attention': "Today's score is lower than usual. Let's focus on rest and easy-to-eat nourishing foods.",
  }
};

export const getRandomMessage = (state) => {
  const msgs = NOBI_MESSAGES[state];
  if (Array.isArray(msgs)) return msgs[Math.floor(Math.random() * msgs.length)];
  return msgs;
};

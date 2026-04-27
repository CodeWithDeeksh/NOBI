import { foodRecommendations } from '../data/foodRecommendations';

export const runNourishEngine = (spiral, tap, voice, trend) => {
  let constraint = null;
  let reason = '';

  // Severity checks
  if (voice !== null && voice < 60) {
    constraint = { texture: ['liquid', 'soft'] };
    reason = "Your voice test was briefly sustained today. I've picked soft, moist foods that are easy to swallow safely.";
  } else if (spiral !== null && spiral < 60) {
    constraint = { tags: ['easy-grip'] };
    reason = "I noticed some tremor in your spiral drawing today. I've selected easy-grip foods so you don't have to worry about utensils.";
  } else if (tap !== null && tap < 60) {
    constraint = { tags: ['energizing', 'b12', 'high-protein'] };
    reason = "Your tapping speed was a little low. Let's get your energy up with some protein and B12-rich foods away from your medication window.";
  } else if (trend !== null && trend < 0) {
    constraint = { tags: ['anti-fatigue', 'iron', 'fiber'] };
    reason = "Your scores have dropped slightly over the last few sessions. Let's focus on anti-fatigue and nutrient-rich meals.";
  } else {
    constraint = { tags: ['neuroprotective', 'mediterranean'] };
    reason = "Your motor control looks very stable! Let's maintain this with a Mediterranean, neuroprotective diet.";
  }

  // Filter food database based on constraint
  let filtered = [...foodRecommendations];
  if (constraint.texture) {
    filtered = filtered.filter(f => constraint.texture.includes(f.texture));
  }
  if (constraint.tags) {
    filtered = filtered.filter(f => f.tags.some(t => constraint.tags.includes(t)));
  }

  // Fallback if filter is too strict
  if (filtered.length < 3) filtered = [...foodRecommendations];

  // Group by meal type
  const breakfast = filtered.find(f => f.mealType === 'breakfast') || foodRecommendations.find(f => f.mealType === 'breakfast');
  const lunch = filtered.find(f => f.mealType === 'lunch') || foodRecommendations.find(f => f.mealType === 'lunch');
  const dinner = filtered.find(f => f.mealType === 'dinner') || foodRecommendations.find(f => f.mealType === 'dinner');

  return {
    meals: [breakfast, lunch, dinner].filter(Boolean),
    insight: reason
  };
};

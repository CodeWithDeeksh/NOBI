export const foodRecommendations = [
  {
    id: 'med-breakfast',
    mealType: 'breakfast',
    name: 'Mediterranean Breakfast Bowl',
    tags: ['mediterranean', 'neuroprotective', 'low-protein'],
    texture: 'easy',
    proteinLevel: 'low',
    description: 'Oatmeal with blueberries, chia seeds, and a dash of cinnamon. Great for brain health and easy to eat.',
    suitableFor: ['Stable', 'Mild Variation', 'Needs Attention']
  },
  {
    id: 'soft-fish',
    mealType: 'dinner',
    name: 'Baked Salmon & Mashed Sweet Potato',
    tags: ['omega-3', 'anti-inflammatory', 'high-protein'],
    texture: 'soft',
    proteinLevel: 'high',
    description: 'Soft, flaky fish with easy-to-swallow sweet potatoes. Rich in Omega-3s to fight inflammation.',
    suitableFor: ['Stable', 'Mild Variation', 'Needs Attention']
  },
  {
    id: 'energy-smoothie',
    mealType: 'breakfast',
    name: 'High-B12 Energy Smoothie',
    tags: ['energizing', 'b12', 'drinkable'],
    texture: 'liquid',
    proteinLevel: 'moderate',
    description: 'Blend of banana, spinach, almond milk, and fortified nutritional yeast to boost your energy before medication.',
    suitableFor: ['Mild Variation', 'Needs Attention']
  },
  {
    id: 'easy-grip-snack',
    mealType: 'lunch',
    name: 'Cut-up Fruit & Nut Butter',
    tags: ['easy-grip', 'fiber', 'snack'],
    texture: 'easy',
    proteinLevel: 'low',
    description: 'Bite-sized apples or bananas with almond butter. Requires minimal dexterity and helps with hydration/fiber.',
    suitableFor: ['Stable', 'Mild Variation']
  },
  {
    id: 'pureed-soup',
    mealType: 'dinner',
    name: 'Creamy Lentil & Carrot Soup',
    tags: ['fiber', 'b-vitamins', 'pureed'],
    texture: 'liquid',
    proteinLevel: 'high',
    description: 'Warm, comforting, and packed with nutrients. Easy to consume when fatigue is high.',
    suitableFor: ['Needs Attention']
  }
];

export const getRecommendationsForScore = (score) => {
  const level = score >= 80 ? 'Stable' : score >= 60 ? 'Mild Variation' : 'Needs Attention';
  return foodRecommendations.filter(food => food.suitableFor.includes(level)).slice(0, 3);
};

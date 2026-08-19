export const setMealForDay = (mealPlan, day, recipeId) => ({ ...mealPlan, [day]: recipeId });
export const clearMealForDay = (mealPlan, day) => {
  const next = { ...mealPlan };
  delete next[day];
  return next;
};

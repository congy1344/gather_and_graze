/** Global recipe, favorites, and meal-plan state provider. */
import { createContext, useCallback, useContext, useMemo } from 'react';
import { mockRecipes } from '../data/mockRecipes';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { clearMealForDay, setMealForDay } from '../utils/mealPlan.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const recipes = mockRecipes;
  const isLoading = false;
  const [favorites, setFavorites] = useLocalStorage('gather:favorites', []);
  const [mealPlan, setMealPlan] = useLocalStorage('gather:meal-plan', {});

  const toggleFavorite = useCallback((recipeId) => {
    setFavorites((current) => current.includes(recipeId)
      ? current.filter((id) => id !== recipeId)
      : [...current, recipeId]);
  }, [setFavorites]);

  const addToMealPlan = useCallback((day, recipeId) => {
    setMealPlan((current) => setMealForDay(current, day, recipeId));
  }, [setMealPlan]);

  const clearDay = useCallback((day) => {
    setMealPlan((current) => clearMealForDay(current, day));
  }, [setMealPlan]);

  const value = useMemo(() => ({
    recipes, isLoading, favorites, mealPlan, toggleFavorite, addToMealPlan, clearDay,
  }), [recipes, isLoading, favorites, mealPlan, toggleFavorite, addToMealPlan, clearDay]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}

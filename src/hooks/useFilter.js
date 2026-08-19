import { useMemo } from 'react';
import { filterRecipes } from '../utils/filterRecipes.js';

export { filterRecipes } from '../utils/filterRecipes.js';

/** Filters and sorts recipes using the supplied controls. */
export function useFilter(recipes, search, category, sortBy, language) {
  return useMemo(
    () => filterRecipes(recipes, search, category, sortBy, language),
    [recipes, search, category, sortBy, language],
  );
}

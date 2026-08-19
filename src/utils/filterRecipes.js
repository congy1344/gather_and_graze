import { localize } from '../data/mockRecipes.js';
import { labelKeys, translations } from '../data/translations.js';

const normalize = (value = '') => value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function filterRecipes(recipes, search, category, sortBy, language = 'en') {
  const query = normalize(search.trim());
  const filtered = recipes.filter((recipe) => {
    const ingredientText = recipe.ingredients.flatMap((item) => Object.values(item.name));
    const categoryKey = labelKeys[recipe.category];
    const categoryText = [recipe.category, translations.en[categoryKey], translations.vi[categoryKey]];
    const searchable = [...Object.values(recipe.name), ...ingredientText, ...Object.values(recipe.tags), ...categoryText].filter(Boolean).join(' ');
    return (!query || normalize(searchable).includes(query)) && (category === 'All' || recipe.category === category);
  });
  return [...filtered].sort((a, b) => sortBy === 'prepTime'
    ? a.prepTime - b.prepTime
    : localize(a.name, language).localeCompare(localize(b.name, language), language));
}

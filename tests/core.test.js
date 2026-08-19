import test from 'node:test';
import assert from 'node:assert/strict';
import { mockRecipes } from '../src/data/mockRecipes.js';
import { filterRecipes } from '../src/utils/filterRecipes.js';
import { clearMealForDay, setMealForDay } from '../src/utils/mealPlan.js';

test('recipe content is distinct and fully bilingual', () => {
  assert.equal(mockRecipes.length, 12);
  assert.equal(new Set(mockRecipes.map((recipe) => JSON.stringify(recipe.ingredients))).size, 12);
  for (const recipe of mockRecipes) {
    assert.ok(recipe.name.en && recipe.name.vi && recipe.description.en && recipe.description.vi);
    assert.ok(recipe.ingredients.every((item) => item.name.en && item.name.vi && item.unit.en && item.unit.vi));
    assert.ok(recipe.steps.every((item) => item.instruction.en && item.instruction.vi));
  }
});

test('search matches localized names, ingredients, categories, and tags without accents', () => {
  assert.equal(filterRecipes(mockRecipes, 'ca hoi', 'All', 'name', 'vi')[0].id, 'rec-007');
  assert.ok(filterRecipes(mockRecipes, 'tahini', 'All', 'name', 'en').length >= 2);
  assert.ok(filterRecipes(mockRecipes, 'bua sang', 'All', 'name', 'vi').every((recipe) => recipe.category === 'Breakfast'));
  assert.ok(filterRecipes(mockRecipes, 'khong can nau', 'All', 'name', 'vi').some((recipe) => recipe.id === 'rec-005'));
});

test('category filtering and prep-time sorting compose', () => {
  const result = filterRecipes(mockRecipes, '', 'Dinner', 'prepTime', 'en');
  assert.deepEqual(result.map((recipe) => recipe.prepTime), [15, 15, 20]);
});

test('meal plan helpers replace and clear without mutating previous state', () => {
  const original = { Monday: 'rec-001' };
  const replaced = setMealForDay(original, 'Monday', 'rec-007');
  const cleared = clearMealForDay(replaced, 'Monday');
  assert.deepEqual(original, { Monday: 'rec-001' });
  assert.deepEqual(replaced, { Monday: 'rec-007' });
  assert.deepEqual(cleared, {});
});

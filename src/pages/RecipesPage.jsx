/** Searchable and filterable recipe catalog page. */
import { useState } from 'react';
import FilterBar from '../components/recipe/FilterBar';
import RecipeCard from '../components/recipe/RecipeCard';
import EmptyState from '../components/common/EmptyState';
import SkeletonGrid from '../components/common/SkeletonGrid';
import PageWrapper from '../components/layout/PageWrapper';
import { useApp } from '../context/AppContext';
import { useDebounce } from '../hooks/useDebounce';
import { useFilter } from '../hooks/useFilter';
import { useUI } from '../context/UIPreferencesContext';

export default function RecipesPage() {
  const { recipes, isLoading, favorites, toggleFavorite } = useApp();
  const { language, t } = useUI();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const results = useFilter(recipes, useDebounce(search), category, sortBy, language);
  return <PageWrapper><header className="page-header"><div><h1>{t('findFavorite')}</h1><p>{t('recipeIntro')}</p></div><p className="result-count" aria-live="polite"><strong>{results.length}</strong> {t('results')}</p></header><FilterBar search={search} onSearch={setSearch} category={category} onCategory={setCategory} sortBy={sortBy} onSort={setSortBy} />{isLoading ? <SkeletonGrid /> : results.length ? <div className="recipe-grid">{results.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} isFavorited={favorites.includes(recipe.id)} onToggleFavorite={toggleFavorite} />)}</div> : <EmptyState title={t('noRecipes')} message={t('noRecipesMessage')} />}</PageWrapper>;
}

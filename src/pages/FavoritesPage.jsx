/** Saved recipe collection page. */
import { Link } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import PageWrapper from '../components/layout/PageWrapper';
import RecipeCard from '../components/recipe/RecipeCard';
import { useApp } from '../context/AppContext';
import { useUI } from '../context/UIPreferencesContext';

export default function FavoritesPage() {
  const { recipes, favorites, toggleFavorite } = useApp();
  const { t } = useUI();
  const saved = recipes.filter((recipe) => favorites.includes(recipe.id));
  return <PageWrapper><header className="page-header"><div><h1>{t('favoritesTitle')}</h1><p>{t('favoritesIntro')}</p></div></header>{saved.length ? <div className="recipe-grid">{saved.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} isFavorited onToggleFavorite={toggleFavorite} />)}</div> : <EmptyState title={t('shelfWaiting')} message={t('shelfMessage')} action={<Link className="button button--primary" to="/recipes">{t('exploreRecipes')}</Link>} />}</PageWrapper>;
}

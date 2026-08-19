/** Task-first landing page with one clear starting point and a varied collection. */
import { Link } from 'react-router-dom';
import RecipeCard from '../components/recipe/RecipeCard';
import SkeletonGrid from '../components/common/SkeletonGrid';
import { useApp } from '../context/AppContext';
import { useUI } from '../context/UIPreferencesContext';
import { localize } from '../data/mockRecipes';

export default function HomePage() {
  const { recipes, isLoading, favorites, toggleFavorite } = useApp();
  const { language, t } = useUI();
  const featured = recipes[0];
  const highlights = [recipes[1], recipes[3], recipes[6], recipes[8]].filter(Boolean);
  if (isLoading || !featured) return <div className="page-wrapper"><SkeletonGrid count={3} /></div>;
  const featuredName = localize(featured.name, language);
  return <><section className="hero"><div className="hero__content"><p className="hero__kicker">{t('featuredRecipe')}</p><h1>{t('heroTitle')}</h1><p>{localize(featured.description, language)}</p><div className="hero__actions"><Link className="button button--primary button--lg" to={`/recipes/${featured.id}`}>{t('cook')} {featuredName}</Link><Link className="text-link" to="/recipes">{t('exploreAll')} →</Link></div></div><Link className="hero__visual" to={`/recipes/${featured.id}`} aria-label={`${t('viewRecipe')}: ${featuredName}`}><img src={featured.image} alt={featuredName} /></Link></section><section className="page-wrapper collection-section"><header className="page-header"><div><h2>{t('worthGathering')}</h2></div><Link className="text-link" to="/recipes">{t('browseCollection')} →</Link></header><div className="popular-row">{highlights.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} isFavorited={favorites.includes(recipe.id)} onToggleFavorite={toggleFavorite} />)}</div></section></>;
}

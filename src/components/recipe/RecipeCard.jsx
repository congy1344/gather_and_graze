/** Recipe preview with explicit prep and total-time metadata. */
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { useUI } from '../../context/UIPreferencesContext';
import { localize } from '../../data/mockRecipes';

export default function RecipeCard({ recipe, isFavorited, onToggleFavorite }) {
  const { language, t, label } = useUI();
  const name = localize(recipe.name, language);
  return <article className="recipe-card"><div className="recipe-card__visual"><img className="recipe-card__image" src={recipe.image} alt="" loading="lazy" /><button className="recipe-card__favorite" onClick={() => onToggleFavorite(recipe.id)} aria-label={`${t(isFavorited ? 'removeFavorite' : 'addFavorite')}: ${name}`}><span aria-hidden="true">{isFavorited ? '✓' : '+'}</span></button></div><div className="recipe-card__body"><div className="recipe-card__top"><Badge>{label(recipe.category)}</Badge><span className="recipe-card__difficulty">{label(recipe.difficulty)}</span></div><h3 className="recipe-card__title"><Link to={`/recipes/${recipe.id}`}>{name}</Link></h3><dl className="recipe-card__meta"><div><dt>{t('prepTime')}</dt><dd>{recipe.prepTime} {t('min')}</dd></div><div><dt>{t('totalTime')}</dt><dd>{recipe.prepTime + recipe.cookTime} {t('min')}</dd></div></dl><Link className="text-link" to={`/recipes/${recipe.id}`}>{t('viewRecipe')} →</Link></div></article>;
}

/** Localized recipe workspace with scalable ingredients and explicit planning feedback. */
import { useEffect, useReducer, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import CustomSelect from '../components/common/CustomSelect';
import PageWrapper from '../components/layout/PageWrapper';
import { days, localize } from '../data/mockRecipes';
import { useApp } from '../context/AppContext';
import { useUI } from '../context/UIPreferencesContext';

function stepsReducer(state, action) { return action.type === 'toggle' ? { ...state, [action.id]: !state[action.id] } : {}; }

export default function RecipeDetailPage() {
  const { id } = useParams();
  const { recipes, isLoading, favorites, mealPlan, toggleFavorite, addToMealPlan, clearDay } = useApp();
  const { language, t, label } = useUI();
  const recipe = recipes.find((item) => item.id === id);
  const [servings, setServings] = useState(recipe?.servings || 1);
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [done, dispatch] = useReducer(stepsReducer, {});
  const [favoriteMessage, setFavoriteMessage] = useState('');
  const [planFeedback, setPlanFeedback] = useState(null);
  useEffect(() => { if (recipe) setServings(recipe.servings); }, [recipe]);
  if (isLoading) return <PageWrapper><div className="skeleton skeleton--detail" role="status"><span className="sr-only">{language === 'vi' ? 'Đang tải công thức' : 'Loading recipe'}</span></div></PageWrapper>;
  if (!recipe) return <PageWrapper><h1>{t('recipeMissing')}</h1><Link className="button button--primary" to="/recipes">{t('backRecipes')}</Link></PageWrapper>;
  const ratio = servings / recipe.servings;
  const name = localize(recipe.name, language);
  const isFavorited = favorites.includes(recipe.id);
  const existingRecipeId = mealPlan[selectedDay];
  const dayOptions = days.map((day) => ({ value: day, label: label(day) }));
  const handleFavorite = () => { toggleFavorite(recipe.id); setFavoriteMessage(t(isFavorited ? 'favoriteRemoved' : 'favoriteAdded')); };
  const handlePlan = () => {
    addToMealPlan(selectedDay, recipe.id);
    setPlanFeedback({ day: selectedDay, previousId: existingRecipeId, message: `${t(existingRecipeId ? 'mealReplaced' : 'mealAdded')} ${label(selectedDay)}.` });
  };
  const undoPlan = () => {
    if (planFeedback.previousId) addToMealPlan(planFeedback.day, planFeedback.previousId);
    else clearDay(planFeedback.day);
    setPlanFeedback(null);
  };
  return <PageWrapper><Link className="back-link" to="/recipes">← {t('backCollection')}</Link><article className="detail"><div className="detail__visual"><img src={recipe.image} alt={name} /></div><div className="detail__intro"><Badge>{label(recipe.category)}</Badge><h1>{name}</h1><p>{localize(recipe.description, language)}</p><dl className="detail__meta"><div><dt>{t('prepTime')}</dt><dd>{recipe.prepTime} {t('min')}</dd></div><div><dt>{t('cookTime')}</dt><dd>{recipe.cookTime} {t('min')}</dd></div><div><dt>{t('totalTime')}</dt><dd>{recipe.prepTime + recipe.cookTime} {t('min')}</dd></div><div><dt>{t('level')}</dt><dd>{label(recipe.difficulty)}</dd></div></dl><p className="detail__time-note">{t('totalTimeHint')}</p><div className="detail__actions"><Button onClick={handleFavorite} variant={isFavorited ? 'secondary' : 'primary'}>{t(isFavorited ? 'removeFavorite' : 'addFavorite')}</Button><CustomSelect className="detail__day-select" value={selectedDay} options={dayOptions} onChange={setSelectedDay} label={t('mealDay')} /><Button variant="ghost" onClick={handlePlan}>{t(existingRecipeId ? 'replaceOnDay' : 'addToDay')} {label(selectedDay)}</Button></div><p className="sr-only" role="status" aria-live="polite">{favoriteMessage}</p>{planFeedback && <div className="action-feedback" role="status" aria-live="polite"><span>{planFeedback.message}</span><Button size="sm" variant="ghost" onClick={undoPlan}>{t('undo')}</Button></div>}</div></article><div className="recipe-workspace"><section className="panel"><div className="panel__header"><h2>{t('need')}</h2><div className="serving-control"><Button size="sm" variant="ghost" disabled={servings <= 1} onClick={() => setServings((value) => value - 1)} aria-label={t('decrease')}>−</Button><strong>{servings} {t('servings')}</strong><Button size="sm" variant="ghost" onClick={() => setServings((value) => value + 1)} aria-label={t('increase')}>+</Button></div></div><ul className="ingredient-list">{recipe.ingredients.map((ingredient) => <li key={ingredient.id}><span>{localize(ingredient.name, language)}</span><strong>{Number((ingredient.amount * ratio).toFixed(1))} {localize(ingredient.unit, language)}</strong></li>)}</ul></section><section className="panel"><h2>{t('stepsTitle')}</h2><ol className="step-list">{recipe.steps.map((step, index) => <li className={done[step.id] ? 'step-list__item--done' : ''} key={step.id}><button onClick={() => dispatch({ type: 'toggle', id: step.id })} aria-pressed={Boolean(done[step.id])} aria-label={`${t('markStep')} ${index + 1} ${t(done[step.id] ? 'asNotDone' : 'asDone')}`}>{done[step.id] ? '✓' : index + 1}</button><p>{localize(step.instruction, language)}</p></li>)}</ol></section></div></PageWrapper>;
}

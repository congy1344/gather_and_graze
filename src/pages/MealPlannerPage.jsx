/** Weekly meal planning with explicit add, replace, remove, and undo feedback. */
import { useMemo, useState } from 'react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import PageWrapper from '../components/layout/PageWrapper';
import { days, localize } from '../data/mockRecipes';
import { useApp } from '../context/AppContext';
import { useUI } from '../context/UIPreferencesContext';

export default function MealPlannerPage() {
  const { recipes, mealPlan, addToMealPlan, clearDay } = useApp();
  const { language, t, label } = useUI();
  const [activeDay, setActiveDay] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const planned = useMemo(() => days.map((day) => recipes.find((recipe) => recipe.id === mealPlan[day])).filter(Boolean), [recipes, mealPlan]);
  const chooseMeal = (recipe) => {
    const previousId = mealPlan[activeDay];
    addToMealPlan(activeDay, recipe.id);
    setFeedback({ day: activeDay, previousId, message: `${t(previousId ? 'mealReplaced' : 'mealAdded')} ${label(activeDay)}.` });
    setActiveDay(null);
  };
  const removeMeal = (day) => {
    const previousId = mealPlan[day];
    clearDay(day);
    setFeedback({ day, previousId, message: `${t('mealRemoved')} ${label(day)}.` });
  };
  const undo = () => {
    if (feedback.previousId) addToMealPlan(feedback.day, feedback.previousId);
    else clearDay(feedback.day);
    setFeedback(null);
  };
  return <PageWrapper><header className="page-header"><div><h1>{t('planTitle')}</h1><p>{t('planIntro')}</p></div></header>{feedback && <div className="action-feedback" role="status" aria-live="polite"><span>{feedback.message}</span><Button size="sm" variant="ghost" onClick={undo}>{t('undo')}</Button></div>}<div className="planner-grid">{days.map((day) => { const recipe = recipes.find((item) => item.id === mealPlan[day]); return <article className="day-card" key={day}><header><h2>{label(day)}</h2></header>{recipe ? <div className="day-card__meal"><img src={recipe.image} alt="" loading="lazy" /><Badge>{label(recipe.category)}</Badge><h3>{localize(recipe.name, language)}</h3><div className="day-card__actions"><Button size="sm" variant="ghost" onClick={() => setActiveDay(day)}>{t('replaceMeal')}</Button><Button size="sm" variant="danger" onClick={() => removeMeal(day)}>{t('removeMeal')}</Button></div></div> : <button className="day-card__empty" onClick={() => setActiveDay(day)}><span aria-hidden="true">+</span>{t('addMeal')}</button>}</article>; })}</div><section className="planner-summary"><h2>{planned.length} {t('mealsPlanned')}</h2><p>{new Set(planned.map((recipe) => recipe.category)).size} {t('uniqueCategories')}</p></section><Modal isOpen={Boolean(activeDay)} onClose={() => setActiveDay(null)} closeLabel={t('closeModal')} title={`${t('chooseMeal')} ${activeDay ? label(activeDay) : ''}`}><div className="picker-list">{recipes.map((recipe) => <button key={recipe.id} onClick={() => chooseMeal(recipe)}><img src={recipe.image} alt="" loading="lazy" /><span><strong>{localize(recipe.name, language)}</strong><small>{label(recipe.category)} · {recipe.prepTime} {t('min')}</small></span></button>)}</div></Modal></PageWrapper>;
}

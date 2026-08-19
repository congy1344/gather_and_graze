/** Root application routes, navigation landmarks, and route focus management. */
import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppErrorBoundary from './components/common/AppErrorBoundary';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import MealPlannerPage from './pages/MealPlannerPage';
import FavoritesPage from './pages/FavoritesPage';
import { useUI } from './context/UIPreferencesContext';

function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() => document.getElementById('main-content')?.focus({ preventScroll: true }));
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const { t } = useUI();
  return <><a className="skip-link" href="#main-content">{t('skipContent')}</a><RouteEffects /><Navbar /><main className="app-main" id="main-content" tabIndex="-1"><AppErrorBoundary><div className="page-transition" key={location.pathname}><Routes location={location}><Route path="/" element={<HomePage />} /><Route path="/recipes" element={<RecipesPage />} /><Route path="/recipes/:id" element={<RecipeDetailPage />} /><Route path="/meal-planner" element={<MealPlannerPage />} /><Route path="/favorites" element={<FavoritesPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></div></AppErrorBoundary></main></>;
}

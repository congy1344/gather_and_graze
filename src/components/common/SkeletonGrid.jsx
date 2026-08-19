/** Loading placeholders that expose one concise live status. */
import { useUI } from '../../context/UIPreferencesContext';
export default function SkeletonGrid({ count = 6 }) {
  const { language } = useUI();
  const status = language === 'vi' ? 'Đang tải công thức' : 'Loading recipes';
  return <div className="loading-region" role="status" aria-live="polite"><span className="sr-only">{status}</span><div className="recipe-grid" aria-hidden="true">{Array.from({ length: count }, (_, index) => <div className="skeleton" key={index} />)}</div></div>;
}

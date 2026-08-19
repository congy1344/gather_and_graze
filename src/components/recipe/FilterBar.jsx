/** Search, category, and sort controls for recipes. */
import { categories } from '../../data/mockRecipes';
import Button from '../common/Button';
import CustomSelect from '../common/CustomSelect';
import { useUI } from '../../context/UIPreferencesContext';

export default function FilterBar({ search, onSearch, category, onCategory, sortBy, onSort }) {
  const { t, label } = useUI();
  const sortOptions = [
    { value: 'name', label: t('nameSort') },
    { value: 'prepTime', label: t('prepTime') },
  ];
  return <section className="filter-bar" aria-label={t('filters')}><input className="input" value={search} onChange={(event) => onSearch(event.target.value)} placeholder={t('search')} aria-label={t('search')} /><div className="filter-bar__categories">{categories.map((item) => <Button key={item} variant={category === item ? 'primary' : 'ghost'} size="sm" onClick={() => onCategory(item)} aria-pressed={category === item}>{label(item)}</Button>)}</div><CustomSelect className="filter-bar__sort" value={sortBy} options={sortOptions} onChange={onSort} label={t('sort')} /></section>;
}

/** Functional wrapper providing a localized route-level error boundary. */
import { ErrorBoundary } from 'react-error-boundary';
import { useUI } from '../../context/UIPreferencesContext';
function ErrorFallback() {
  const { t } = useUI();
  return <div className="page-wrapper empty-state" role="alert"><h1>{t('errorTitle')}</h1><p>{t('errorMessage')}</p></div>;
}
export default function AppErrorBoundary({ children }) {
  return <ErrorBoundary fallback={<ErrorFallback />}>{children}</ErrorBoundary>;
}

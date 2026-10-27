import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { intakeApiUrl } from '@/utils/apiUrl';

const visitStorageKey = 'e-value-bibliography-visit';

const beginVisit = (): boolean => {
  try {
    if (window.sessionStorage.getItem(visitStorageKey)) return false;
    window.sessionStorage.setItem(visitStorageKey, '1');
    return true;
  } catch {
    // Browsers that block session storage still contribute page views.
    return true;
  }
};

const AnalyticsTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const newVisit = beginVisit();

    fetch(intakeApiUrl('/api/pageviews'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        path: location.pathname,
        referrer: newVisit ? document.referrer : '',
        new_visit: newVisit,
      }),
      credentials: 'omit',
      keepalive: true,
    }).catch(() => {
      // Analytics must never interrupt reading the bibliography.
    });
  }, [location.pathname]);

  return null;
};

export default AnalyticsTracker;

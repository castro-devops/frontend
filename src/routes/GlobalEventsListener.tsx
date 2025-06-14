import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Connection500 from '@/pages/Errors/Conection500';
import { API_BASE_URL } from '@/config/api';

export function GlobalEventsListener() {
  const navigate = useNavigate();
  const [hasConnectionError, setHasConnectionError] = useState(false);

  useEffect(() => {
    const onAuthFailed = () => {
      navigate('/');
    };

    const onConnectionError = () => {
      setHasConnectionError(true);
    };

    window.addEventListener('auth-failed', onAuthFailed);
    window.addEventListener('connection-error', onConnectionError);

    return () => {
      window.removeEventListener('auth-failed', onAuthFailed);
      window.removeEventListener('connection-error', onConnectionError);
    };
  }, [navigate]);

  useEffect(() => {
    if (!hasConnectionError) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          cache: 'no-store',
        });

        if (res.ok) {
          setHasConnectionError(false);
        }
      } catch {
        // continua em erro
      }
    }, 5000); // 5 segundos

    return () => clearInterval(interval);
  }, [hasConnectionError]);

  if (hasConnectionError) {
    return <Connection500 />;
  }

  return null;
}

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { CenterType } from '@/types';

interface AnalysisRequest {
  type: 'misery' | 'synthesis';
  bleeding?: CenterType;
  sacrifice?: CenterType;
  oxygen?: string[];
  synthesis?: string;
}

export function useAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (request: AnalysisRequest): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Debes iniciar sesión para usar SRAP-AI');
      }

      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/srap-analyze`;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.analysis;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión con SRAP-AI';
      setError(errorMessage);
      return 'Error de conexión. Incluso la IA te ha abandonado hoy.';
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, error };
}

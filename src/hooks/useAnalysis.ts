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

// Check for Chrome's built-in AI (Window AI / AI Nano)
declare global {
  interface Window {
    ai?: {
      canCreateTextSession: () => Promise<string>;
      createTextSession: () => Promise<{
        prompt: (text: string) => Promise<string>;
        destroy: () => void;
      }>;
    };
  }
}

export function useAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSystemPrompt = (type: 'misery' | 'synthesis') => {
    if (type === 'misery') {
      return "You are SRAP-AI. Brutally honest, cynical, philosophical. Analyze the user's sacrifice and bleeding center. No comfort. War metaphors.";
    }
    return "You are SRAP-AI. Evaluate if the user's synthesis is honest or self-deception. Be relentless but useful. End with a sharp question.";
  };

  const analyzeWithLocalAI = async (request: AnalysisRequest): Promise<string | null> => {
    try {
      if (window.ai) {
        const canCreate = await window.ai.canCreateTextSession();
        if (canCreate === 'readily') {
          const session = await window.ai.createTextSession();
          const systemPrompt = getSystemPrompt(request.type);
          const userPrompt = JSON.stringify(request);
          const result = await session.prompt(`${systemPrompt}\n\nUser Data: ${userPrompt}`);
          session.destroy();
          return result;
        }
      }
    } catch (e) {
      console.error('Local AI (Nano) error:', e);
    }
    return null;
  };

  const analyze = async (request: AnalysisRequest): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      // 1. Try Local IA Nano first (Privacy-first / Fast)
      const localResult = await analyzeWithLocalAI(request);
      if (localResult) {
        console.log('Analyzed using local IA Nano');
        return localResult;
      }

      // 2. Fallback to Cloud (Gemini via Supabase Edge Function)
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Inicia sesión para acceder al análisis profundo o activa IA Nano en tu navegador.');
      }

      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/srap-analysis`;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Error remoto (${response.status}). La realidad es dura.`);
      }

      const data = await response.json();
      return data.analysis;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión con SRAP-AI';
      setError(errorMessage);
      return 'Conexión fallida. Incluso la IA te ha abandonado hoy. Confía en tu propio instinto crudo.';
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, error };
}

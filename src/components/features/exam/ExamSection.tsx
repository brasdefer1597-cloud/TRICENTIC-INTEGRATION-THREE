import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAnalysis } from '@/hooks/useAnalysis';
import { supabase } from '@/lib/supabase';
import { calculateXPGained, shouldUnlockAchievement } from '@/lib/gamification';
import type { CenterType } from '@/types';

interface ExamSectionProps {
  onEvaluationComplete?: () => void;
}

const ExamSection: React.FC<ExamSectionProps> = ({ onEvaluationComplete }) => {
  const [bleeding, setBleeding] = useState<CenterType | ''>('');
  const [sacrifice, setSacrifice] = useState<CenterType | ''>('');
  const [oxygen, setOxygen] = useState<string[]>([]);
  const [synthesis, setSynthesis] = useState<string>('');

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { analyze, loading: analyzing } = useAnalysis();

  const handleOxygenChange = (value: string) => {
    setOxygen(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const handleAcceptReality = async () => {
    if (!bleeding || !sacrifice) {
      alert("Complete diagnostic and sacrifice first.");
      return;
    }

    const result = await analyze({
      type: 'misery',
      bleeding: bleeding as CenterType,
      sacrifice: sacrifice as CenterType,
      oxygen,
    });

    setAiAnalysis(result);
    setIsModalOpen(true);
  };

  const handleAnalyzeSynthesis = async () => {
    if (!synthesis.trim()) {
      alert("Write your synthesis first.");
      return;
    }

    const result = await analyze({
      type: 'synthesis',
      synthesis,
    });

    setAiAnalysis(result);
    setIsModalOpen(true);
  };

  const handleSaveEvaluation = async () => {
    if (!bleeding || !sacrifice || !synthesis.trim()) {
      alert("Complete all fields before saving.");
      return;
    }

    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("You must log in to save evaluations.");
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile) {
        await supabase.from('user_profiles').insert({ id: user.id });
      }

      const today = new Date().toISOString().split('T')[0];
      const lastEvalDate = profile?.last_evaluation_date;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const isConsecutiveDay = lastEvalDate === yesterday;
      const newStreak = lastEvalDate === today ? profile.streak_days : (isConsecutiveDay ? profile.streak_days + 1 : 1);

      const xpGained = calculateXPGained(newStreak);
      const newXP = (profile?.experience_points || 0) + xpGained;
      const newTotalEvals = (profile?.total_evaluations || 0) + 1;

      await supabase.from('evaluations').insert({
        user_id: user.id,
        bleeding_center: bleeding,
        sacrifice_center: sacrifice,
        oxygen_actions: oxygen,
        synthesis_text: synthesis,
        ai_analysis: aiAnalysis || '',
        xp_earned: xpGained,
      });

      await supabase.from('user_profiles').update({
        experience_points: newXP,
        total_evaluations: newTotalEvals,
        streak_days: newStreak,
        last_evaluation_date: today,
      }).eq('id', user.id);

      const achievementKeys = ['first_blood', 'week_warrior', 'ten_evaluations', 'level_5'];
      for (const key of achievementKeys) {
        if (shouldUnlockAchievement(key, { totalEvaluations: newTotalEvals, currentLevel: 1, streakDays: newStreak })) {
          const { data: achievement } = await supabase.from('achievements').select('id').eq('key', key).maybeSingle();
          if (achievement) {
            await supabase.from('user_achievements').insert({
              user_id: user.id,
              achievement_id: achievement.id,
            });
          }
        }
      }

      setBleeding('');
      setSacrifice('');
      setOxygen([]);
      setSynthesis('');
      setAiAnalysis(null);

      alert(`Evaluation saved. +${xpGained} XP earned.`);

      if (onEvaluationComplete) onEvaluationComplete();

    } catch (error) {
      console.error('Error saving evaluation:', error);
      alert('Error saving evaluation.');
    } finally {
      setSaving(false);
    }
  };
  
  const OXYGEN_OPTIONS = [
    "5 minutes of conscious breathing (Body)",
    "Write 1 unfiltered raw truth (Heart)",
    "Do 1 real survival calculation (Head)"
  ];

  const loading = analyzing || saving;

  return (
    <>
      {isModalOpen && aiAnalysis && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="AI DIAGNOSIS"
          icon="🎯"
        >
          <p className="whitespace-pre-line">{aiAnalysis}</p>
        </Modal>
      )}
      <section className="py-12 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-red-400">🎯 SRAP EXAM - RAW REALITY</h2>
        
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-red-800">
          <div className="text-center mb-8">
            <div className="breathing-crudo w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">💀</span>
            </div>
            <p className="text-gray-400 italic mb-4">
              "Enlightenment is not perpetual peace. It is knowing that fear in the chest,
              mental calculation and trembling in the hands are the normal orchestra of being alive."
            </p>
            <p className="text-yellow-400 font-semibold">
              Wisdom is not letting any drown the others.
            </p>
          </div>

          {loading && (
            <div className="my-8">
              <LoadingSpinner message={saving ? 'SAVING REALITY...' : 'ANALYZING...'} />
            </div>
          )}

          <div className="space-y-6">
                <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-red-400 mb-4">1. RAW DIAGNOSIS</h3>
                    <p className="text-gray-300 mb-4">Which of the three centers is bleeding MOST today?</p>
                    
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'head' as CenterType, label: 'Head', icon: '🧠', ringColor: 'ring-blue-400', bgColor: 'bg-blue-900' },
                  { id: 'heart' as CenterType, label: 'Heart', icon: '💔', ringColor: 'ring-red-400', bgColor: 'bg-red-900' },
                  { id: 'body' as CenterType, label: 'Body', icon: '🦶', ringColor: 'ring-green-400', bgColor: 'bg-green-900' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBleeding(item.id)}
                    aria-pressed={bleeding === item.id}
                    className={`flex items-center space-x-3 p-3 ${item.bgColor} bg-opacity-20 rounded-lg cursor-pointer transition-all duration-200 ring-2 focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-900 ${bleeding === item.id ? item.ringColor : 'ring-transparent hover:bg-opacity-30'}`}
                  >
                    <span className="text-xl" aria-hidden="true">{item.icon}</span>
                    <span className="font-bold text-gray-300">{item.label}</span>
                  </button>
                ))}
              </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-red-400 mb-4">2. CONSCIOUS SACRIFICE</h3>
                    <p className="text-gray-300 mb-4">Which center has to give in TODAY so the other two survive?</p>
                    
              <select
                value={sacrifice}
                onChange={e => setSacrifice(e.target.value as CenterType)}
                className="w-full bg-black bg-opacity-50 text-white p-3 rounded-lg border border-red-600 focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all"
              >
                <option value="">Choose today's sacrifice...</option>
                <option value="head">Head: Accept chaos, stop controlling</option>
                <option value="heart">Heart: Postpone dreams, accept reality</option>
                <option value="body">Body: Ignore fatigue, keep moving</option>
              </select>
                </div>

                <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-red-400 mb-4">3. SURVIVAL OXYGEN</h3>
                    <p className="text-gray-300 mb-4">What minimal action can give oxygen to the most drowned center?</p>
                    
                    <div className="space-y-3">
                      {OXYGEN_OPTIONS.map(opt => (
                        <label key={opt} className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${oxygen.includes(opt) ? 'bg-red-900 bg-opacity-40 border border-red-600' : 'bg-gray-700'}`}>
                            <input
                              type="checkbox"
                              checked={oxygen.includes(opt)}
                              onChange={() => handleOxygenChange(opt)}
                              className="w-5 h-5 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500 accent-red-500"
                            />
                            <span className="text-sm text-gray-300">{opt}</span>
                        </label>
                      ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 p-6 bg-red-900 bg-opacity-20 border border-red-700 rounded-xl">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">💎 RAW INTEGRATION</h3>
                <textarea 
                    id="synthesis-text"
                    value={synthesis}
                    onChange={e => setSynthesis(e.target.value)}
                    placeholder='Write your realistic synthesis. Example: "Today the body bleeds most. I will sacrifice mental control (head) to give 10 minutes of rest to the body. The heart will wait until tomorrow."'
                    className="w-full h-32 bg-black bg-opacity-50 border border-yellow-600 rounded-lg p-4 text-white focus:outline-none resize-none focus:ring-2 focus:ring-yellow-400 transition-all"
                ></textarea>
                
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleAcceptReality}
                disabled={loading}
                className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-8 rounded-lg transition-all pulse-realidad disabled:bg-gray-700 disabled:cursor-not-allowed disabled:animate-none"
              >
                💀 ACCEPT REALITY
              </button>
              <button
                onClick={handleAnalyzeSynthesis}
                disabled={loading || !synthesis.trim()}
                className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg transition-all disabled:bg-gray-700 disabled:cursor-not-allowed"
              >
                🔬 ANALYZE SYNTHESIS
              </button>
              <button
                onClick={handleSaveEvaluation}
                disabled={loading || !bleeding || !sacrifice || !synthesis.trim()}
                className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-lg transition-all disabled:bg-gray-700 disabled:cursor-not-allowed"
              >
                💾 SAVE
              </button>
            </div>
            </div>
        </div>
      </section>
    </>
  );
};

export default ExamSection;

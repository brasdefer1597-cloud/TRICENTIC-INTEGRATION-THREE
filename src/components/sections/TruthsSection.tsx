import React from 'react';

const TruthsSection: React.FC = () => {
  return (
    <section className="py-12 px-6 max-w-6xl mx-auto">
      <div className="hard-truth rounded-2xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-red-400 mb-6">🔪 UNFILTERED TRUTHS</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="reality-card body-card rounded-xl p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🦶</div>
              <h3 className="text-xl font-bold text-green-400">THE BODY ALWAYS WINS</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              You can ignore it for years with coffee, stress, and fake smiles. But one day it collapses. And the
              medical bill will never be poetic.
            </p>
            <div className="mt-4 p-3 bg-green-900 bg-opacity-20 rounded-lg">
              <p className="text-green-300 text-xs italic">
                "Cancer doesn't ask 'what do you care about?' before appearing"
              </p>
            </div>
          </div>

          <div className="reality-card heart-card rounded-xl p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">💔</div>
              <h3 className="text-xl font-bold text-red-400">THE HEART IS A POOR STRATEGIST</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-2">
              Following "your passion" without a plan is a recipe for ending up:
            </p>
            <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
              <li>In debt</li>
              <li>Exploited by those who did plan</li>
              <li>Selling "high vibe" courses</li>
            </ul>
          </div>

          <div className="reality-card head-card rounded-xl p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🧊</div>
              <h3 className="text-xl font-bold text-blue-400">HEAD WITHOUT HEART CREATES MONSTERS</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              CEOs optimizing layoffs. Politicians calculating collateral damage. You deciding "it's logical" while
              killing something inside you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TruthsSection;

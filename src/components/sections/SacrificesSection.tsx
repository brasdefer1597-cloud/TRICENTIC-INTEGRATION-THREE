import React from 'react';

const SacrificesSection: React.FC = () => (
  <section className="py-12 px-6 max-w-6xl mx-auto -mt-12">
    <div className="integration-cruda rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-red-400 mb-6">⚰️ DAILY SACRIFICES</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border border-dashed border-gray-600 rounded-lg bg-gray-800">
          <h4 className="font-bold text-yellow-400 mb-2">❌ NO "PERFECT BALANCE"</h4>
          <p className="text-gray-300 text-sm">
            You will choose which center to sacrifice today. You can't have it all. The
            question is not "how to balance?" but "whose turn is it to suffer today?"
          </p>
        </div>

        <div className="p-4 border border-dashed border-gray-600 rounded-lg bg-gray-800">
          <h4 className="font-bold text-yellow-400 mb-2">⏳ INEVITABLE DECLINE</h4>
          <p className="text-gray-300 text-sm">
            Your body ages, your head forgets, your heart scars poorly. Every choice
            accelerates the wear and tear of some center.
          </p>
        </div>

        <div className="p-4 border border-dashed border-gray-600 rounded-lg bg-gray-800">
          <h4 className="font-bold text-yellow-400 mb-2">💉 SIMULTANEOUS BLEEDING</h4>
          <p className="text-gray-300 text-sm">
            The only real integration is accepting that sometimes you bleed from all three
            places at once. Welcome to being alive.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default SacrificesSection;

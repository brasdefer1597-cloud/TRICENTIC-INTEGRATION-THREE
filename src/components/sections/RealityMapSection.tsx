import React from 'react';

const RealityMapSection: React.FC = () => (
  <section className="py-12 px-6 max-w-6xl mx-auto">
    <div className="bg-gray-800 rounded-2xl p-8 border border-yellow-700">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">🗺️ REALITY MAP</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-yellow-600">
              <th className="text-left py-4 text-yellow-400 min-w-[80px]">Center</th>
              <th className="text-left py-4 text-yellow-400 min-w-[120px]">Promises You</th>
              <th className="text-left py-4 text-yellow-400 min-w-[200px]">Reality Demands</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="py-4 font-semibold text-blue-400">🧠 Head</td>
              <td className="py-4 text-gray-300">Control</td>
              <td className="py-4 text-gray-300">Accept chaos + act anyway</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="py-4 font-semibold text-red-400">💓 Heart</td>
              <td className="py-4 text-gray-300">Meaning</td>
              <td className="py-4 text-gray-300">Tolerate emptiness + build sense</td>
            </tr>
            <tr>
              <td className="py-4 font-semibold text-green-400">🦶 Body</td>
              <td className="py-4 text-gray-300">Pleasure</td>
              <td className="py-4 text-gray-300">Endure pain + move anyway</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default RealityMapSection;

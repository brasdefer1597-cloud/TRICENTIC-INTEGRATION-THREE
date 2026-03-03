import React from 'react';

const HeaderSection: React.FC = () => {
  return (
    <header className="text-center py-12 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-400 via-red-400 to-gray-600 bg-clip-text text-transparent">
        SRAP - RAW REALITIES
      </h1>
      <p className="text-xl md:text-2xl mb-8 font-semibold text-gray-400 max-w-3xl mx-auto">
        "Your heart wants to change the world, your body begs for rest, and your head knows that tomorrow rent is due."
      </p>

      <nav aria-label="Atajos" className="flex items-center justify-center gap-3 flex-wrap">
        <a href="#exam" className="btn-quick-access bg-red-700 hover:bg-red-800">
          Ir al examen
        </a>
        <a href="#integration" className="btn-quick-access bg-yellow-600 hover:bg-yellow-700 text-black">
          Ir a integración
        </a>
      </nav>
    </header>
  );
};

export default HeaderSection;

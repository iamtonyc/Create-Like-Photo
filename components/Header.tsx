
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-8 flex items-center justify-between border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <i className="fas fa-camera-retro text-white text-xl"></i>
        </div>
        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Create Like Photo
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <a 
          href="https://ai.google.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          GEMINI API
        </a>
      </div>
    </header>
  );
};

export default Header;


import React from 'react';
import { LESSONS } from '../constants';

const Lessons: React.FC = () => {
  const navTo = (path: string) => window.location.hash = `#${path}`;

  return (
    <div className="max-w-5xl mx-auto w-full py-12 px-6">
      <h2 className="text-5xl font-black mb-12 text-white uppercase italic tracking-tighter">Mastery Path</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LESSONS.map((l) => (
          <div 
            key={l.id} 
            onClick={() => navTo(`/typing/lesson/${l.id}`)} 
            className="group p-8 bg-gray-900/40 border border-gray-800 rounded-[2.5rem] hover:border-amber-400 cursor-pointer transition-all shadow-xl"
          >
            <h3 className="font-black text-xl text-gray-100 group-hover:text-amber-400 transition-colors uppercase">{l.title}</h3>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">{l.description}</p>
            <div className="mt-6 flex gap-2">
              {l.keys.map(k => (
                <span key={k} className="w-8 h-8 rounded-lg bg-black flex items-center justify-center font-bold text-gray-500 uppercase border border-gray-800 text-xs">
                  {k}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lessons;

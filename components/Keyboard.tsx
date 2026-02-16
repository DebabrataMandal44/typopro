
import React from 'react';
import { LAYOUTS, LayoutName } from '../services/keyboardLayout';

interface Props {
  expectedChar?: string;
  lastErrorKey?: string | null;
  showHints?: boolean;
  layout?: LayoutName;
}

const Keyboard: React.FC<Props> = ({ 
  expectedChar, 
  lastErrorKey, 
  showHints = true,
  layout = 'qwerty'
}) => {
  if (!showHints) return null;

  const rows = LAYOUTS[layout] || LAYOUTS.qwerty;

  const isShiftRequired = expectedChar && (
    (expectedChar >= 'A' && expectedChar <= 'Z') ||
    '~!@#$%^&*()_+{}|:"<>?'.includes(expectedChar)
  );

  const getHighlightClass = (key: string) => {
    const normalizedKey = key.toLowerCase();
    const normalizedExpected = expectedChar?.toLowerCase();

    if (normalizedKey === normalizedExpected) {
      return 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.5)] scale-105 z-10';
    }
    
    if (key === 'Shift' && isShiftRequired) {
      return 'bg-amber-400/50 text-black';
    }

    if (key.toLowerCase() === lastErrorKey?.toLowerCase()) {
      return 'bg-red-500 text-white animate-shake';
    }

    return 'bg-gray-800 text-gray-400 border-b-4 border-black/40';
  };

  const getKeyWidth = (key: string) => {
    switch (key) {
      case 'Space': return 'w-72';
      case 'Backspace': return 'w-24';
      case 'Tab': return 'w-16';
      case 'Caps': return 'w-20';
      case 'Enter': return 'w-20';
      case 'Shift': return 'w-28';
      case 'Ctrl':
      case 'Opt':
      case 'Cmd': return 'w-14';
      default: return 'w-12';
    }
  };

  return (
    <div className="bg-gray-950 p-6 rounded-[2.5rem] border border-gray-800 shadow-2xl max-w-fit mx-auto select-none pointer-events-none">
      <div className="flex flex-col gap-1.5">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-1.5 justify-center">
            {row.map((key, j) => {
              return (
                <div 
                  key={j}
                  className={`
                    ${getKeyWidth(key)} 
                    h-12 rounded-xl flex items-center justify-center text-[11px] font-bold uppercase transition-all duration-150
                    ${getHighlightClass(key)}
                  `}
                >
                  {key}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard;


import React from 'react';

const SNIPPETS = [
  {
    lang: 'TypeScript',
    code: 'const calculate = (a: number, b: number): number => { return a + b; };'
  },
  {
    lang: 'JavaScript',
    code: 'document.addEventListener("click", () => { console.log("clicked"); });'
  },
  {
    lang: 'Python',
    code: 'def main():\n  for i in range(10):\n    print(f"Index: {i}")'
  },
  {
    lang: 'Go',
    code: 'func main() { fmt.Println("Hello, TypoPro") }'
  }
];

interface Props {
  onSelect: (text: string) => void;
}

const CodeMode: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in zoom-in duration-300">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-white mb-2">Code Mode</h2>
        <p className="text-gray-400">Master symbols and syntax with real programming snippets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SNIPPETS.map((s, idx) => (
          <div 
            key={idx}
            onClick={() => onSelect(s.code)}
            className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-amber-400/50 cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black bg-amber-400/10 text-amber-400 px-2 py-1 rounded uppercase tracking-widest">{s.lang}</span>
              <span className="text-gray-600 text-[10px] group-hover:text-gray-400">Select Snippet</span>
            </div>
            <pre className="mono text-xs text-gray-500 overflow-hidden text-ellipsis bg-black/30 p-4 rounded-lg whitespace-pre-wrap">
              {s.code}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeMode;


import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AppMode, SessionResult, KeyStats } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  text: string;
  mode: AppMode;
  onComplete: (result: SessionResult) => void;
  onCancel: () => void;
  onStart?: () => void;
  onProgress?: (snapshot: { wpm: number; accuracy: number; errors: number }) => void;
  strictMode?: boolean;
}

interface TypedEvent {
  index: number;
  typed: string;
  expected: string;
  isCorrect: boolean;
  timestamp: number;
  latency: number;
}

const TypingEngine: React.FC<Props> = ({ text, mode, onComplete, onCancel, onStart, onProgress, strictMode = false }) => {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [compositionActive, setCompositionActive] = useState(false);

  const typedHistoryRef = useRef<TypedEvent[]>([]);
  const lastKeyTimeRef = useRef<number>(0);
  const keyStatsRef = useRef<Record<string, KeyStats>>(storageService.getUserStats().keyStats);
  const inputRef = useRef<HTMLInputElement>(null);

  const words = useMemo(() => text.split(" "), [text]);
  const flatChars = useMemo(() => text.split(""), [text]);
  const currentGlobalIndex = userInput.length;

  const wordIndices = useMemo(() => {
    let indices: number[] = [0];
    let current = 0;
    words.forEach((w) => {
        current += w.length + 1;
        indices.push(current);
    });
    return indices;
  }, [words]);

  const currentWordIndex = wordIndices.findIndex((idx, i) => {
    const nextIdx = wordIndices[i + 1] ?? Infinity;
    return currentGlobalIndex >= idx && currentGlobalIndex < nextIdx;
  });

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isFinished || compositionActive) return;
    if (e.key === "Tab") {
      e.preventDefault();
      onCancel();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const val = e.target.value;
    const isDeletion = val.length < userInput.length;

    if (!isDeletion && val.length > 0) {
      if (!startTime) {
        setStartTime(Date.now());
        onStart?.();
      }
      
      const idx = userInput.length;
      const typedChar = val[idx];
      const expectedChar = flatChars[idx];
      const now = Date.now();
      const latency = lastKeyTimeRef.current === 0 ? 0 : now - lastKeyTimeRef.current;
      lastKeyTimeRef.current = now;

      const isCorrect = typedChar === expectedChar;
      
      typedHistoryRef.current.push({
        index: idx,
        typed: typedChar || "",
        expected: expectedChar || "",
        isCorrect,
        timestamp: now,
        latency
      });

      if (expectedChar) {
        const stats = keyStatsRef.current[expectedChar] || { attempts: 0, errors: 0, totalLatency: 0, confusions: {} };
        stats.attempts++;
        stats.totalLatency += latency;
        if (!isCorrect) {
          stats.errors++;
          stats.confusions[typedChar || "unknown"] = (stats.confusions[typedChar || "unknown"] || 0) + 1;
        }
        keyStatsRef.current[expectedChar] = stats;
      }
    } else if (isDeletion) {
      typedHistoryRef.current.pop();
    }

    setUserInput(val);

    const now = Date.now();
    const dur = (now - (startTime || now)) / 60000;
    const correctCount = typedHistoryRef.current.filter(h => h.isCorrect).length;
    const currentWpm = dur > 0 ? Math.round((correctCount / 5) / dur) : 0;
    const currentAcc = val.length > 0 ? Math.round((correctCount / val.length) * 100) : 100;

    setWpm(currentWpm);
    setAccuracy(currentAcc);
    
    onProgress?.({ wpm: currentWpm, accuracy: currentAcc, errors: val.length - correctCount });

    if (val.length >= text.length) {
      finishSession(val, correctCount);
    }
  };

  const finishSession = (finalInput: string, correctCount: number) => {
    setIsFinished(true);
    const endTime = Date.now();
    const durationSeconds = (endTime - (startTime || endTime)) / 1000;
    const finalWpm = Math.round((correctCount / 5) / (durationSeconds / 60)) || 0;
    const rawWpm = Math.round((finalInput.length / 5) / (durationSeconds / 60)) || 0;
    
    const problemKeys = (Object.entries(keyStatsRef.current) as [string, KeyStats][])
      .filter(([_, stats]) => stats.attempts > 5 && (stats.errors / stats.attempts > 0.15))
      .map(([key]) => key);

    const result: SessionResult = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: endTime,
      mode,
      wpm: finalWpm,
      rawWpm,
      accuracy: Math.round((correctCount / Math.max(1, finalInput.length)) * 100),
      errors: finalInput.length - correctCount,
      duration: durationSeconds,
      problemKeys
    };

    storageService.saveSession(result, keyStatsRef.current);
    onComplete(result);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 mono text-2xl font-bold text-amber-400">
        <div className="flex space-x-12">
          <div><span className="text-gray-500 text-sm block uppercase tracking-widest">WPM</span>{wpm}</div>
          <div><span className="text-gray-500 text-sm block uppercase tracking-widest">Accuracy</span>{accuracy}%</div>
        </div>
      </div>

      <div className="relative text-3xl mono leading-relaxed min-h-[240px] p-8 bg-gray-900/40 rounded-3xl border border-gray-800" onClick={() => inputRef.current?.focus()}>
        <input ref={inputRef} type="text" className="absolute opacity-0 pointer-events-none" value={userInput} onChange={handleInputChange} onKeyDown={handleKeyDown} onPaste={(e) => e.preventDefault()} autoFocus />
        <div className="flex flex-wrap gap-x-3">
          {words.map((word, wIdx) => (
            <Word key={wIdx} word={word} wordInput={userInput.slice(wordIndices[wIdx], wordIndices[wIdx+1] ? wordIndices[wIdx+1]-1 : undefined)} isCurrent={wIdx === currentWordIndex} globalStartIndex={wordIndices[wIdx]} currentGlobalIndex={currentGlobalIndex} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Word = React.memo(({ word, wordInput, isCurrent, globalStartIndex, currentGlobalIndex }: any) => (
  <span className={`relative pb-1 mb-2 ${isCurrent ? 'border-b-2 border-amber-500/50' : ''}`}>
    {word.split("").map((char: string, cIdx: number) => {
      const charGlobalIdx = globalStartIndex + cIdx;
      let colorClass = "text-gray-600";
      if (charGlobalIdx < currentGlobalIndex) colorClass = wordInput[cIdx] === char ? "text-gray-200" : "text-red-500";
      return <span key={cIdx} className={`${colorClass} relative`}>{charGlobalIdx === currentGlobalIndex && <span className="caret -top-1" />}{char}</span>;
    })}
    {currentGlobalIndex === globalStartIndex + word.length && isCurrent && <span className="relative"><span className="caret -top-1" />&nbsp;</span>}
  </span>
));

export default TypingEngine;

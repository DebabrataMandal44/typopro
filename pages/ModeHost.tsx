
import React, { useState, useEffect, useRef } from 'react';
import { registry } from '../plugins/registry';
import { UserSettings, SessionResult } from '../types';
import TypingEngine from '../components/TypingEngine';
import Keyboard from '../components/Keyboard';
import { bus } from '../bus/bus';

interface Props {
  modeId: string;
  context?: string;
  settings: UserSettings;
  onComplete: (result: SessionResult) => void;
  onCancel: () => void;
}

const ModeHost: React.FC<Props> = ({ modeId, context, settings, onComplete, onCancel }) => {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const modeConfig = registry.getModeConfig(modeId, settings);
  
  const sessionLocalId = useRef(Math.random().toString(36).substr(2, 9)).current;
  const lastProgressEmit = useRef(0);

  useEffect(() => {
    async function fetchText() {
      if (!modeConfig) return;
      setLoading(true);
      try {
        const result = await modeConfig.getTargetText(context);
        setText(result);
      } catch (e) {
        setText("Error loading typing content.");
      } finally {
        setLoading(false);
      }
    }
    fetchText();
  }, [modeId, context, settings]);

  const handleStart = () => {
    bus.emit('session/started', {
      modeId,
      sessionLocalId,
      startedAtMs: Date.now()
    });
  };

  const handleProgress = (snapshot: { wpm: number; accuracy: number; errors: number }) => {
    const now = Date.now();
    // Throttle progress events to 200ms
    if (now - lastProgressEmit.current > 200) {
      bus.emit('session/progress', {
        modeId,
        sessionLocalId,
        elapsedMs: 0, // Placeholder
        snapshot
      });
      lastProgressEmit.current = now;
    }
  };

  const handleCompleteInternal = (result: SessionResult) => {
    bus.emit('session/ended', {
      modeId,
      sessionLocalId,
      stats: result,
      endedAtMs: Date.now()
    });
    onComplete(result);
  };

  if (!modeConfig) return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
      <div className="text-red-500 text-xl font-bold mb-4 italic">Plugin missing or disabled</div>
      <p className="text-gray-500 mb-8">The mode "{modeId}" requires an active plugin.</p>
      <button onClick={onCancel} className="bg-gray-800 px-6 py-2 rounded-xl text-sm font-bold">Back</button>
    </div>
  );

  if (loading) return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="text-amber-400 font-black animate-pulse text-2xl uppercase tracking-tighter">Preparing {modeConfig.label}...</div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col justify-center py-12">
      <TypingEngine 
        text={text || ""} 
        mode={modeId as any}
        onComplete={handleCompleteInternal}
        onCancel={onCancel}
        onStart={handleStart}
        onProgress={handleProgress}
      />
      <div className="mt-12">
        <Keyboard 
          expectedChar={text ? text[0] : ""} 
          showHints={settings.showKeyboardHints} 
          layout={settings.keyboardLayout}
        />
      </div>
    </div>
  );
};

export default ModeHost;

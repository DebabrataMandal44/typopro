
import { TypoProPlugin } from '../types';
import { generateAdaptiveDrill } from '../../services/geminiService';
import { storageService } from '../../services/storageService';

export const drillsPlugin: TypoProPlugin = {
  id: 'mode-drills',
  name: 'Smart Drills',
  type: 'mode',
  order: 30,
  defaultEnabled: true,
  isEnabled: (s) => s.enabledPlugins.includes('mode-drills'),

  navLinks: [{ id: 'drill', label: 'Drills', to: '/typing/drill', order: 30 }],
  
  homeCards: [{
    id: 'drills-card',
    title: 'Adaptive Drills',
    description: 'AI practice targeting your weak keys.',
    order: 30,
    onClick: () => window.location.hash = '#/typing/drill'
  }],

  modeConfig: {
    modeId: 'drill',
    label: 'Adaptive Drill',
    description: 'Targeted practice.',
    order: 30,
    keyboardHintsDefault: true,
    getTargetText: async () => {
      const stats = storageService.getUserStats();
      const weakKeys = Object.entries(stats.keyStats)
        .filter(([_, s]) => s.attempts > 0 && (s.errors / s.attempts > 0.1))
        .map(([k]) => k);
      return await generateAdaptiveDrill(weakKeys, stats.keyStats);
    }
  }
};

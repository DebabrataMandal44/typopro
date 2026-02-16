
import { TypoProPlugin } from '../types';
import { COMMON_WORDS } from '../../constants';

export const testPlugin: TypoProPlugin = {
  id: 'mode-test',
  name: 'Typing Test',
  type: 'mode',
  order: 10,
  defaultEnabled: true,
  isEnabled: (s) => s.enabledPlugins.includes('mode-test'),
  
  navLinks: [{ id: 'test', label: 'Test', to: '/typing/test', order: 10 }],
  
  homeCards: [{
    id: 'test-card',
    title: 'Typing Test',
    description: 'The standard speed test to benchmark your progress.',
    order: 10,
    onClick: () => window.location.hash = '#/typing/test'
  }],

  modeConfig: {
    modeId: 'test',
    label: 'Typing Test',
    description: 'Benchmark your WPM.',
    order: 10,
    keyboardHintsDefault: true,
    getTargetText: () => {
      return Array.from({ length: 40 }, () => 
        COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]
      ).join(" ");
    }
  }
};


import { TypoProPlugin } from '../types';

export const codePlugin: TypoProPlugin = {
  id: 'mode-code',
  name: 'Code Mode',
  type: 'mode',
  order: 40,
  defaultEnabled: false,
  isEnabled: (s) => s.betaFeatures.codeMode && s.enabledPlugins.includes('mode-code'),

  navLinks: [{ id: 'code', label: 'Code', to: '/code', order: 40, beta: true }],
  
  homeCards: [{
    id: 'code-card',
    title: 'Code Practice',
    description: 'Master symbols and syntax.',
    order: 40,
    beta: true,
    onClick: () => window.location.hash = '#/code'
  }],

  modeConfig: {
    modeId: 'code',
    label: 'Code Practice',
    description: 'Programming syntax practice.',
    order: 40,
    keyboardHintsDefault: false,
    getTargetText: (context: string) => context || "const x = 10;"
  }
};

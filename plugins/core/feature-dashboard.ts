
import { TypoProPlugin } from '../types';

export const dashboardPlugin: TypoProPlugin = {
  id: 'feature-dashboard',
  name: 'Analytics',
  type: 'feature',
  order: 50,
  defaultEnabled: true,
  isEnabled: (s) => s.enabledPlugins.includes('feature-dashboard'),
  navLinks: [{ id: 'dashboard', label: 'Dashboard', to: '/dashboard', order: 50 }]
};

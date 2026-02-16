
import { UserSettings } from '../types';
import { TypedBus } from '../bus/bus';

export type PluginType = 'mode' | 'feature';

export interface PluginContext {
  bus: TypedBus;
  getSettings: () => UserSettings;
  logger: {
    info: (msg: string, ...args: any[]) => void;
    warn: (msg: string, ...args: any[]) => void;
    error: (msg: string, ...args: any[]) => void;
  };
}

export interface ContributionRoute {
  path: string;
  element: React.ReactNode;
  title?: string;
}

export interface ContributionNavLink {
  id: string;
  label: string;
  to: string;
  order: number;
  beta?: boolean;
}

export interface ContributionHomeCard {
  id: string;
  title: string;
  description: string;
  onClick: () => void;
  order: number;
  beta?: boolean;
}

export interface ContributionSettingsSection {
  id: string;
  title: string;
  description?: string;
  render: (settings: UserSettings, onUpdate: (settings: UserSettings) => void) => React.ReactNode;
}

export interface ModePluginConfig {
  modeId: string;
  label: string;
  description: string;
  beta?: boolean;
  order: number;
  keyboardHintsDefault: boolean;
  getTargetText: (context?: any) => Promise<string> | string;
}

export interface TypoProPlugin {
  id: string;
  name: string;
  type: PluginType;
  order: number;
  defaultEnabled: boolean;
  requires?: string[];
  conflicts?: string[];
  isEnabled: (settings: UserSettings) => boolean;
  
  // Lifecycles
  onRegister?: (ctx: PluginContext) => void;
  onExport?: () => any;
  onImport?: (data: any) => void;

  // Contributions
  routes?: ContributionRoute[];
  navLinks?: ContributionNavLink[];
  homeCards?: ContributionHomeCard[];
  settingsSections?: ContributionSettingsSection[];
  modeConfig?: ModePluginConfig;
}

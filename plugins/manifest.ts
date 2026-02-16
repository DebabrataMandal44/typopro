
import { registry } from './registry';
import { testPlugin } from './core/mode-test';
import { lessonsPlugin } from './core/mode-lessons';
import { drillsPlugin } from './core/mode-drills';
import { codePlugin } from './core/mode-code';
import { dashboardPlugin } from './core/feature-dashboard';
import { settingsPlugin } from './core/feature-settings';
import { dataPlugin } from './core/feature-data';
import { goalsPlugin } from './feature/goalsPlugin';

// Bus Plugins
import { sessionLoggerPlugin } from './feature/sessionLoggerPlugin';
import { recommendationPlugin } from './feature/recommendationPlugin';

export function initializePlugins() {
  registry.register(testPlugin);
  registry.register(lessonsPlugin);
  registry.register(drillsPlugin);
  registry.register(codePlugin);
  registry.register(dashboardPlugin);
  registry.register(settingsPlugin);
  registry.register(dataPlugin);
  registry.register(goalsPlugin);
  
  // New internal features
  registry.register(sessionLoggerPlugin);
  registry.register(recommendationPlugin);
}

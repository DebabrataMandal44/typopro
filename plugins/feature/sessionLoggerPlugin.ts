
import { TypoProPlugin } from '../types';

export const sessionLoggerPlugin: TypoProPlugin = {
  id: 'feature-session-logger',
  name: 'Session Logger',
  type: 'feature',
  order: 900,
  defaultEnabled: true,
  isEnabled: (s) => s.enabledPlugins.includes('feature-session-logger'),

  onRegister: (ctx) => {
    ctx.bus.on('session/started', (data) => {
      ctx.logger.info(`Session Started: ${data.modeId} (${data.sessionLocalId})`);
    });

    ctx.bus.on('session/ended', (data) => {
      ctx.logger.info(`Session Ended: ${data.stats.wpm} WPM, ${data.stats.accuracy}% Accuracy`);
    });

    ctx.bus.on('network/status', (data) => {
      ctx.logger.info(`Network Status Changed: ${data.online ? 'Online' : 'Offline'}`);
    });
  }
};

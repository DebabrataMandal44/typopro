
import { TypoProPlugin } from '../types';

export const recommendationPlugin: TypoProPlugin = {
  id: 'feature-recommendations',
  name: 'Smart Recommendations',
  type: 'feature',
  order: 910,
  defaultEnabled: true,
  isEnabled: (s) => s.enabledPlugins.includes('feature-recommendations'),

  onRegister: (ctx) => {
    ctx.bus.on('session/ended', (data) => {
      let text = "Ready for another test?";
      let actionHash = "#/typing/test";

      if (data.stats.accuracy < 95) {
        text = `Accuracy was ${data.stats.accuracy}%. Try an adaptive drill to fix problem keys.`;
        actionHash = "#/typing/drill";
      } else if (data.stats.wpm > 80) {
        text = "Great speed! Challenge yourself with some Code Mode practice.";
        actionHash = "#/code";
      }

      ctx.bus.emit('recommendation/updated', { text, actionHash });
      localStorage.setItem('typro_last_rec', JSON.stringify({ text, actionHash }));
    });
  }
};

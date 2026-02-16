
import { TypoProPlugin } from '../types';
import { LESSONS } from '../../constants';

export const lessonsPlugin: TypoProPlugin = {
  id: 'mode-lessons',
  name: 'Lessons',
  type: 'mode',
  order: 20,
  defaultEnabled: true,
  isEnabled: (s) => s.enabledPlugins.includes('mode-lessons'),

  navLinks: [{ id: 'lesson', label: 'Lessons', to: '/lessons', order: 20 }],
  
  homeCards: [{
    id: 'lessons-card',
    title: 'Mastery Path',
    description: 'Structured touch typing curriculum.',
    order: 20,
    onClick: () => window.location.hash = '#/lessons'
  }],

  modeConfig: {
    modeId: 'lesson',
    label: 'Lesson',
    description: 'Learn touch typing step-by-step.',
    order: 20,
    keyboardHintsDefault: true,
    getTargetText: (context: string) => {
      const lesson = LESSONS.find(l => l.id === context);
      return lesson?.content || "No content.";
    }
  }
};

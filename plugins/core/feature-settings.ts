
import React from 'react';
import { TypoProPlugin } from '../types';
import { registry } from '../registry';

export const settingsPlugin: TypoProPlugin = {
  id: 'feature-settings',
  name: 'Settings',
  type: 'feature',
  order: 100,
  defaultEnabled: true,
  isEnabled: (s) => s.enabledPlugins.includes('feature-settings'),

  settingsSections: [
    {
      id: 'core-appearance',
      title: 'Appearance',
      render: (settings, onUpdate) => React.createElement('div', { className: 'space-y-4' },
        React.createElement('label', { className: 'block' },
          React.createElement('span', { className: 'text-gray-400 text-xs uppercase mb-2 block' }, 'Keyboard Layout'),
          React.createElement('select', {
            value: settings.keyboardLayout,
            onChange: (e: any) => onUpdate({ ...settings, keyboardLayout: e.target.value }),
            className: 'w-full bg-gray-900 border border-gray-800 p-3 rounded-xl'
          },
            React.createElement('option', { value: 'qwerty' }, 'QWERTY'),
            React.createElement('option', { value: 'azerty' }, 'AZERTY'),
            React.createElement('option', { value: 'dvorak' }, 'DVORAK')
          )
        )
      )
    },
    {
      id: 'core-plugins',
      title: 'Modules',
      description: 'Enable or disable application plugins.',
      render: (settings, onUpdate) => {
        const all = registry.getAllPlugins();
        return React.createElement('div', { className: 'space-y-2' },
          all.map(p => React.createElement('label', { key: p.id, className: 'flex items-center justify-between p-3 bg-gray-950 rounded-lg border border-gray-800' },
            React.createElement('span', { className: 'text-sm font-bold' }, p.name),
            React.createElement('input', {
              type: 'checkbox',
              checked: settings.enabledPlugins.includes(p.id),
              onChange: (e: any) => {
                const list = e.target.checked 
                  ? [...settings.enabledPlugins, p.id]
                  : settings.enabledPlugins.filter(id => id !== p.id);
                onUpdate({ ...settings, enabledPlugins: list });
              },
              className: 'w-4 h-4 accent-amber-500'
            })
          ))
        );
      }
    }
  ]
};

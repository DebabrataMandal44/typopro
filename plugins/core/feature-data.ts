
import React, { useState } from 'react';
import { TypoProPlugin } from '../types';
import { backupService, TypoProBackup } from '../../lib/backup';
import { storageService } from '../../services/storageService';
import { bus } from '../../bus/bus';

export const dataPlugin: TypoProPlugin = {
  id: 'feature-data',
  name: 'Data Management',
  type: 'feature',
  order: 110,
  defaultEnabled: true,
  isEnabled: (s) => s.enabledPlugins.includes('feature-data'),

  settingsSections: [
    {
      id: 'data-controls',
      title: 'Data Control',
      description: 'Manage your progress, backups, and privacy.',
      render: (settings, onUpdate) => React.createElement(DataTools, { settings })
    }
  ]
};

const DataTools: React.FC<{ settings: any }> = ({ settings }) => {
  const [resetConfirm, setResetConfirm] = useState("");
  const [importConfirm, setImportConfirm] = useState("");
  const [pendingBackup, setPendingBackup] = useState<TypoProBackup | null>(null);
  const [keepGuestId, setKeepGuestId] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    if (resetConfirm === "RESET") {
      storageService.resetStats(keepGuestId);
      bus.emit('data/reset', { keepGuestId });
      window.location.hash = "#/home";
      window.location.reload();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const backup = await backupService.parseBackupFile(file);
      setPendingBackup(backup);
    } catch (err) {
      setError("Invalid backup file. Please ensure it is a valid TypoPro JSON.");
    }
  };

  const handleImport = () => {
    if (importConfirm === "IMPORT" && pendingBackup) {
      backupService.restoreBackup(pendingBackup);
    }
  };

  return React.createElement('div', { className: 'space-y-8' },
    // Export Section
    React.createElement('div', { className: 'space-y-4' },
      React.createElement('h4', { className: 'text-[10px] text-gray-400 uppercase font-black tracking-widest' }, 'Backup'),
      React.createElement('button', {
        onClick: () => backupService.downloadBackup(),
        className: 'w-full bg-gray-900 border border-gray-800 p-4 rounded-xl text-xs font-bold hover:border-amber-400 transition-colors uppercase tracking-widest text-left flex justify-between items-center'
      }, 
        'Download JSON Backup',
        React.createElement('span', { className: 'text-amber-400' }, '↓')
      )
    ),

    // Import Section
    React.createElement('div', { className: 'space-y-4' },
      React.createElement('h4', { className: 'text-[10px] text-gray-400 uppercase font-black tracking-widest' }, 'Restore'),
      React.createElement('div', { className: 'p-4 bg-gray-950 border border-gray-800 rounded-xl space-y-4' },
        React.createElement('input', {
          type: 'file',
          accept: '.json',
          onChange: handleFileSelect,
          className: 'text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-amber-400 file:text-black hover:file:bg-amber-300 cursor-pointer'
        }),
        error && React.createElement('p', { className: 'text-red-500 text-[10px] font-bold uppercase' }, error),
        pendingBackup && React.createElement('div', { className: 'animate-in fade-in space-y-4' },
           React.createElement('div', { className: 'text-[10px] bg-black/40 p-3 rounded-lg border border-gray-800' },
             React.createElement('p', { className: 'text-gray-400 mb-1' }, 'Backup Summary:'),
             React.createElement('p', { className: 'text-white font-bold uppercase' }, `Sessions: ${pendingBackup.stats.history.length}`),
             React.createElement('p', { className: 'text-white font-bold uppercase' }, `Date: ${new Date(pendingBackup.exportedAt).toLocaleDateString()}`)
           ),
           React.createElement('div', { className: 'space-y-2' },
             React.createElement('p', { className: 'text-[9px] text-gray-500 uppercase font-bold' }, 'Type "IMPORT" to overwrite all current data:'),
             React.createElement('input', {
               type: 'text',
               value: importConfirm,
               onChange: (e) => setImportConfirm(e.target.value.toUpperCase()),
               placeholder: 'IMPORT',
               className: 'w-full bg-black border border-gray-800 p-2 rounded-lg text-sm mono text-amber-400'
             }),
             React.createElement('button', {
               disabled: importConfirm !== "IMPORT",
               onClick: handleImport,
               className: 'w-full p-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors bg-blue-500 text-white disabled:opacity-30'
             }, 'Restore Backup')
           )
        )
      )
    ),

    // Reset Section
    React.createElement('div', { className: 'space-y-4 pt-4 border-t border-gray-800' },
      React.createElement('h4', { className: 'text-[10px] text-red-500 uppercase font-black tracking-widest' }, 'Danger Zone'),
      React.createElement('div', { className: 'p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-4' },
        React.createElement('label', { className: 'flex items-center gap-3 cursor-pointer' },
          React.createElement('input', {
            type: 'checkbox',
            checked: keepGuestId,
            onChange: (e) => setKeepGuestId(e.target.checked),
            className: 'w-3 h-3 accent-red-500'
          }),
          React.createElement('span', { className: 'text-[10px] text-gray-400 font-bold uppercase' }, 'Keep Guest Identifier')
        ),
        React.createElement('div', { className: 'space-y-2' },
          React.createElement('p', { className: 'text-[9px] text-gray-500 uppercase font-bold' }, 'Type "RESET" to confirm:'),
          React.createElement('input', {
            type: 'text',
            value: resetConfirm,
            onChange: (e) => setResetConfirm(e.target.value.toUpperCase()),
            placeholder: 'RESET',
            className: 'w-full bg-black border border-gray-800 p-2 rounded-lg text-sm mono text-red-500'
          }),
          React.createElement('button', {
            disabled: resetConfirm !== "RESET",
            onClick: handleReset,
            className: 'w-full p-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors bg-red-600 text-white disabled:opacity-30'
          }, 'Reset All Progress')
        )
      )
    )
  );
};

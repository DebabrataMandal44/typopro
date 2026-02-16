
import React from 'react';
import { UserSettings } from '../types';
import { registry } from '../plugins/registry';

interface Props {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  onClose: () => void;
}

const Settings: React.FC<Props> = ({ settings, onSave, onClose }) => {
  const sections = registry.getSettingsSections(settings);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Settings</h2>
          <p className="text-gray-500 text-sm mt-1">Configure your TypoPro modules.</p>
        </div>
        <button 
          onClick={onClose}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl font-bold transition-colors text-sm uppercase tracking-widest"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {sections.map(section => (
          <section key={section.id} className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-amber-400 uppercase tracking-widest border-b border-gray-800 pb-2 italic">
                {section.title}
              </h3>
              {section.description && (
                <p className="text-[10px] text-gray-500 mt-2 uppercase font-bold tracking-widest">{section.description}</p>
              )}
            </div>
            {section.render(settings, onSave)}
          </section>
        ))}
      </div>
    </div>
  );
};

export default Settings;

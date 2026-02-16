
import { TypoProPlugin, ContributionRoute, ContributionNavLink, ContributionHomeCard, ContributionSettingsSection, ModePluginConfig, PluginContext } from './types';
import { UserSettings } from '../types';
import { bus } from '../bus/bus';
import { storageService } from '../services/storageService';

class PluginRegistry {
  private plugins: Map<string, TypoProPlugin> = new Map();

  register(plugin: TypoProPlugin) {
    this.plugins.set(plugin.id, plugin);
    
    const ctx: PluginContext = {
      bus: bus,
      getSettings: () => storageService.getUserStats().settings,
      logger: {
        info: (m, ...a) => console.info(`[Plugin:${plugin.id}]`, m, ...a),
        warn: (m, ...a) => console.warn(`[Plugin:${plugin.id}]`, m, ...a),
        error: (m, ...a) => console.error(`[Plugin:${plugin.id}]`, m, ...a),
      }
    };

    if (plugin.onRegister) {
      plugin.onRegister(ctx);
    }
  }

  isPluginEffectivelyEnabled(pluginId: string, settings: UserSettings): boolean {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return false;
    if (!plugin.isEnabled(settings)) return false;
    if (plugin.requires) {
      for (const reqId of plugin.requires) {
        if (!this.isPluginEffectivelyEnabled(reqId, settings)) return false;
      }
    }
    if (plugin.conflicts) {
      for (const confId of plugin.conflicts) {
        if (settings.enabledPlugins.includes(confId)) return false;
      }
    }
    return true;
  }

  getEnabledPlugins(settings: UserSettings): TypoProPlugin[] {
    return Array.from(this.plugins.values())
      .filter(p => this.isPluginEffectivelyEnabled(p.id, settings))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getNavLinks(settings: UserSettings): ContributionNavLink[] {
    return this.getEnabledPlugins(settings)
      .flatMap(p => p.navLinks || [])
      .sort((a, b) => a.order - b.order);
  }

  getHomeCards(settings: UserSettings): ContributionHomeCard[] {
    return this.getEnabledPlugins(settings)
      .flatMap(p => p.homeCards || [])
      .sort((a, b) => a.order - b.order);
  }

  getSettingsSections(settings: UserSettings): ContributionSettingsSection[] {
    return this.getEnabledPlugins(settings)
      .flatMap(p => p.settingsSections || [])
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  getModeConfig(modeId: string, settings: UserSettings): ModePluginConfig | undefined {
    const plugin = Array.from(this.plugins.values()).find(p => p.modeConfig?.modeId === modeId);
    if (plugin && this.isPluginEffectivelyEnabled(plugin.id, settings)) {
      return plugin.modeConfig;
    }
    return undefined;
  }

  gatherPluginData(settings: UserSettings): Record<string, any> {
    const data: Record<string, any> = {};
    this.getEnabledPlugins(settings).forEach(p => {
      if (p.onExport) {
        data[p.id] = p.onExport();
      }
    });
    return data;
  }

  restorePluginData(settings: UserSettings, data: Record<string, any>) {
    this.getEnabledPlugins(settings).forEach(p => {
      if (p.onImport && data[p.id]) {
        p.onImport(data[p.id]);
      }
    });
  }

  getAllPlugins(): TypoProPlugin[] {
    return Array.from(this.plugins.values()).sort((a, b) => a.order - b.order);
  }
}

export const registry = new PluginRegistry();

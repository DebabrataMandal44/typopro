
import { z } from 'zod';
import { registry } from '../plugins/registry';
import { storageService } from '../services/storageService';
import { bus } from '../bus/bus';

// Schema Versioning
const BACKUP_VERSION = "1";

const BackupSchema = z.object({
  version: z.string(),
  exportedAt: z.string(),
  stats: z.object({
    totalSessions: z.number(),
    bestWpm: z.number(),
    avgWpm: z.number(),
    totalTime: z.number(),
    streak: z.number(),
    lastActive: z.number(),
    keyStats: z.record(z.any()),
    history: z.array(z.any()),
    settings: z.any(),
  }),
  pluginData: z.record(z.any()).optional(),
  guestId: z.string().optional()
});

export type TypoProBackup = z.infer<typeof BackupSchema>;

export const backupService = {
  generateBackup(): TypoProBackup {
    const stats = storageService.getUserStats();
    return {
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      stats,
      pluginData: registry.gatherPluginData(stats.settings),
      guestId: (stats as any).guestId
    };
  },

  downloadBackup() {
    const data = this.generateBackup();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `typro-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  async parseBackupFile(file: File): Promise<TypoProBackup> {
    const text = await file.text();
    const json = JSON.parse(text);
    return BackupSchema.parse(json);
  },

  restoreBackup(backup: TypoProBackup) {
    // 1. Restore core stats
    storageService.overwriteAll(backup.stats);
    
    // 2. Restore plugin data
    if (backup.pluginData) {
      registry.restorePluginData(backup.stats.settings, backup.pluginData);
    }
    
    bus.emit('data/imported', { version: backup.version, timestamp: Date.now() });
    
    // Hard reload to clean state
    window.location.reload();
  }
};

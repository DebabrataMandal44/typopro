
# TypoPro Plugin System Guide

The application is built around a centralized plugin registry that allows for modular expansion of features and typing modes.

## Plugin Contract
Every plugin must implement the `TypoProPlugin` interface.

```typescript
export interface TypoProPlugin {
  id: string;            // Unique identifier
  name: string;          // Human readable name
  type: 'mode' | 'feature';
  order: number;         // Sorting priority
  defaultEnabled: boolean;
  requires?: string[];   // Plugin IDs needed
  conflicts?: string[];  // Plugin IDs that cannot coexist
  isEnabled: (settings: UserSettings) => boolean;
  
  // Contribution Points
  routes?: ContributionRoute[];
  navLinks?: ContributionNavLink[];
  homeCards?: ContributionHomeCard[];
  settingsSections?: ContributionSettingsSection[];
  modeConfig?: ModePluginConfig;
}
```

## How to add a new Mode Plugin (5 Steps)
1. **Define the Plugin File**: Create `plugins/core/mode-zen.ts`.
2. **Implement `modeConfig`**: Provide the logic for `getTargetText` (e.g., fetch from an API or generate text).
3. **Add Contributions**: Define `navLinks` and `homeCards` so users can find the mode.
4. **Register**: Import and register the plugin in `plugins/manifest.ts`.
5. **Add Feature Flag**: Ensure the plugin checks for its ID in `settings.enabledPlugins`.

## Dependency & Conflicts
The `registry.ts` resolves state at runtime. If a plugin requires another plugin that is disabled, it will not be "effectively enabled" and its contributions will be filtered out.

## Performance Note
- All plugins are statically imported in `manifest.ts` for bundle stability.
- Use `ModeHost` to ensure heavy logic (like text generation) only runs when the specific mode is active.

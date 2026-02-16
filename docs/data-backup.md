
# TypoPro Data Management

TypoPro prioritizes data ownership. All your progress is stored locally, but can be exported for portability.

## Backup Schema (v1)
The backup is a JSON file containing your core stats and any data contributed by active plugins.

```json
{
  "version": "1",
  "exportedAt": "ISO-8601 string",
  "stats": { ...core user stats... },
  "pluginData": {
    "plugin-id": { ...custom data... }
  }
}
```

## How to Backup
1. Navigate to **Settings**.
2. Scroll to the **Data Control** section.
3. Click **Download JSON Backup**.

## How to Restore
1. In **Settings > Data Control**, use the file picker to select your `.json` backup.
2. Review the summary (Session count, date).
3. Type `IMPORT` to confirm.
4. The page will reload, and your data will be restored.

## Safety Measures
- **Confirmation Phrases**: High-risk actions require typing a specific word (RESET or IMPORT).
- **Schema Validation**: Every import is checked against a `Zod` schema to prevent app crashes from malformed data.
- **Reload on Import**: The app performs a full refresh after a restoration to ensure every service is using the new data.

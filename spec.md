# Thozhi - Pengal Nalam

## Current State
The First Aid Guide page loads entries from the backend via `getFirstAidEntries()`. The backend has a `createFirstAidEntry` admin function and `addFirstAidEntry` user function. The `initialize()` function seeds period diet data but does NOT seed any first aid entries (firstAidEntryIdCounter starts at 11 but nothing is added). The frontend renders entries with arrow (→) formatting and allows logged-in users to add new entries.

## Requested Changes (Diff)

### Add
- 10 preloaded first aid entries in the backend `initialize()` function (IDs 1–10):
  1. Fire Burns (Minor Burns) - 6 steps
  2. Cuts & Minor Wounds - 6 steps
  3. Slipped / Bruised Wounds (R.I.C.E method) - 5 steps
  4. Knee Pain / Knee Cramps - 5 steps
  5. Back Pain - 5 steps
  6. Headache - 5 steps
  7. Neck Pain - 5 steps
  8. Shoulder Pain - 5 steps
  9. Muscle Cramps (General) - 5 steps
  10. General First Aid Tips - 7 steps

### Modify
- `initialize()` in main.mo: add the 10 first aid entries using `firstAidEntries.add()` before the `isInitialized := true` line

### Remove
- Nothing

## Implementation Plan
1. Add first aid seed data array in `initialize()` function with all 10 entries (IDs 1–10), formatted with → arrow symbols in each step
2. Set `firstAidEntryIdCounter` to 11 after seeding (already done)
3. No frontend changes needed — the existing FirstAidPage renders entries from backend as-is with → symbols

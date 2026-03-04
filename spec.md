# Thozhi - Pengal Nalam

## Current State
- Full-stack women's wellness app with Diet, First Aid, SOS, Workouts, Services pages
- First Aid page loads entries from backend; only preloaded entries shown (no user-added entries visible)
- Backend `getFirstAidEntries` filters only preloaded=true entries
- No `addFirstAidEntry` function for regular users in backend
- First Aid currently has no preloaded data in `initialize()`
- Steps are rendered with numbered circles, not arrow symbols

## Requested Changes (Diff)

### Add
- 10 preloaded First Aid entries in backend `initialize()`: Fire Burns, Cuts & Minor Wounds, Slipped/Bruised Wounds (R.I.C.E), Knee Pain, Back Pain, Headache, Neck Pain, Shoulder Pain, Muscle Cramps, General First Aid Tips
- `addFirstAidEntry(situation, steps)` backend function for logged-in users to add their own notes
- Arrow symbol (→) rendering for each step in the First Aid UI

### Modify
- `getFirstAidEntries` backend query: return ALL entries (preloaded + user-added), not just preloaded
- `firstAidEntryIdCounter` starts at 11 (after 10 preloaded entries)
- FirstAidPage frontend: render steps with → arrow prefix instead of numbered circles
- Add button visible to logged-in users to add their own first aid notes

### Remove
- Nothing removed

## Implementation Plan
1. Regenerate backend with 10 preloaded first aid entries in initialize(), addFirstAidEntry for users, getFirstAidEntries returns all entries
2. Update FirstAidPage.tsx to render steps with → arrows and wire addFirstAidEntry for logged-in users

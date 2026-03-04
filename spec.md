# Thozhi

## Current State
- Diet page has Pregnancy, Menstrual, and General tabs. Pregnancy and Menstrual tabs have pre-loaded content and an "Add Entry" button for logged-in users (all categories). General diet tab also shows the add button but has no pre-loaded entries.
- Workouts page has Pregnancy, Period Relief, and General tabs. It only displays pre-loaded workout entries fetched from the backend. There is no way for users to add personal notes to any workout category.
- Backend has `addDietEntry` (user-callable) for diet, but no user-callable function to add workout notes.

## Requested Changes (Diff)

### Add
- Backend: `ThozhiWorkoutNote` type (id, category, title, description, createdBy)
- Backend: `addWorkoutNote(category, title, description)` — user-callable, saves a personal workout note
- Backend: `getWorkoutNotesByCategory(category)` — query returning notes for a given category
- Frontend: `useWorkoutNotes(category)` and `useAddWorkoutNote()` hooks in `useQueries.ts`
- Frontend: "Add Note" button in the **General** tab of WorkoutsPage for logged-in users
- Frontend: Dialog to add a workout note (title + description fields)
- Frontend: Display user-added workout notes in the General tab below pre-loaded workouts, with a "Personal Note" badge
- Frontend: General diet tab — add a visible "Add Note" button for logged-in users (currently the button exists but may not be prominent enough); ensure it works and displays user notes with a "Personal Note" / "Community" badge

### Modify
- WorkoutsPage: Add note-adding UI (dialog + button) only visible on the General tab for logged-in users
- WorkoutsPage: Merge static workout entries with user notes for the General tab
- DietPage: Ensure the General tab clearly shows the "Add Entry" button and displays community notes (already partially implemented, confirm it works end-to-end)

### Remove
- Nothing removed

## Implementation Plan
1. Add `ThozhiWorkoutNote` type and `addWorkoutNote` / `getWorkoutNotesByCategory` functions to `main.mo`
2. Regenerate `backend.d.ts` bindings (update manually to match new functions)
3. Add `useWorkoutNotes` and `useAddWorkoutNote` hooks to `useQueries.ts`
4. Update `WorkoutsPage.tsx` to show "Add Note" button + dialog on General tab, fetch and display workout notes
5. Verify DietPage General tab add-entry flow works correctly (no changes needed if already functional)

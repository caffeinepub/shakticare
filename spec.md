# Thozhi - Pengal Nalam

## Current State
- App has Diet, SOS, First Aid, Workouts, Services, and Home pages
- Diet page has Pregnancy, Menstrual, General tabs with backend-stored entries
- Services page shows hospitals/health centres/police stations (read-only from backend)
- Backend `initialize()` seeds police contact only; diet entries start at counter 13 (some seeded previously)
- Logged-in users can add community diet entries visible to all

## Requested Changes (Diff)

### Add
- Pre-loaded Period Care Plan entries for the "menstrual" diet category (8 sections: Foods to Eat, Foods to Avoid, Hydration Tips, Workouts & Movements, Natural Pain Relief Tips, Mood & Mental Health Care, Sample Daily Routine, When to See a Doctor)
- Backend: seed these 8 menstrual diet entries in `initialize()` function
- Services page: allow logged-in users to add new nearby hospitals/health centres with name, address, phone, district, type
- Backend: add `addLocalService` function for users (non-admin) to submit a local service entry
- Voice assistant coverage for new content/UI flows

### Modify
- Backend `initialize()` to seed the 8 Period Care Plan diet entries as `isPreloaded = true`
- Backend `localServiceIdCounter` starts higher to avoid collision with seeded data
- ServicesPage to show an "Add Service" button for logged-in users
- `useQueries.ts` to add `useAddLocalService` mutation hook

### Remove
- Nothing removed

## Implementation Plan
1. Update `main.mo`:
   - Add 8 menstrual Period Care Plan diet entries in `initialize()`
   - Add `addLocalService` public shared function for users (non-admin)
   - Set `dietEntryIdCounter` start higher to avoid collisions with seeded entries
2. Update `useQueries.ts`: add `useAddLocalService` mutation
3. Update `ServicesPage.tsx`: add "Add Service" dialog for logged-in users (name, type, address, phone, district fields) with voice assistant support

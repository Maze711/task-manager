## Summary

Fix search, filter labels, and replace page navigation with modal dialogs.

## Changes

### Bug fixes
- **Search not working** — Removed `mode: "insensitive"` from the Prisma query. SQLite does not support this option and throws a runtime error on any search. SQLite's `LIKE` is already case-insensitive for ASCII, so plain `{ contains: search }` works correctly.
- **FilterBar labels** — Changed "Completed" → "Inactive" to match the spec (All / Active / Inactive)
- **StatusBadge labels** — Shows "Completed" for done tasks, "Incomplete" for pending tasks
- **API route** — Accepts `?status=inactive` instead of `?status=completed`

### Modal improvements
- **New Modal component** — Reusable overlay with backdrop click / Escape key to close, body scroll lock
- **Create Task** — Opens a modal on the dashboard instead of navigating to `/tasks/new`
- **Edit Task** — Opens a modal with prefilled form instead of navigating to `/tasks/:id/edit`
- **Delete confirmation** — Opens a modal overlay instead of inline dropdown
- **Detail page** — Edit and Delete both open modals inline

### SearchBar fix
- Changed from uncontrolled `defaultValue` to controlled `value` + `useState`
- Debounce (300ms) now correctly fires with the latest input value

## Files changed

| File | Change |
|---|---|
| `components/Modal.tsx` | New — reusable modal |
| `components/SearchBar.tsx` | Fixed controlled input + debounce |
| `components/FilterBar.tsx` | Changed Completed → Inactive |
| `components/TaskCard.tsx` | Removed inline confirm, added onEdit/onDeleteClick callbacks |
| `components/TaskList.tsx` | Passes new props to TaskCard |
| `components/StatusBadge.tsx` | Changed Completed → Inactive, then to Completed/Incomplete |
| `app/page.tsx` | New/edit/delete all via modals |
| `app/tasks/[id]/page.tsx` | Edit/delete via modals |
| `app/api/tasks/route.ts` | Removed `mode: insensitive`, accepts `?status=inactive` |

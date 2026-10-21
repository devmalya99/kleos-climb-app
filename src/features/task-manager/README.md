# Task Manager

Tasks inside user-defined categories, shown as the "Tasks" mode of the Clutter tab. Separate from Brain Clutter notes.

## Architecture
- `api/` — categories, tasks, and AI expand/review calls under `/api/brain-clutter/tasks/...`.
- `hooks/useTaskCategories`, `useCategoryTasks` — CRUD with soft-locked errors.
- `hooks/useExpandTasks` — paste → preview (nothing saved) → accept.
- `hooks/useReviewTasks` — review → preview splits → apply the selected ones.
- `store/focusTimer.store` + `hooks/useFocusTimer` — client-only 1–180 min timer (zustand). Closing the sheet unmounts it, which stops and resets the timer.

## API dependencies
`/tasks/categories[/id][/tasks]` · `/tasks[/id]` · `/tasks/expand` · `/tasks/expand/accept` · `/tasks/review` · `/tasks/review/apply`

## Known limitations
- Timer is not synced to the server and does not run in the background.
- No due dates or drag reorder.

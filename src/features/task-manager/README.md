# Task Manager

Tasks inside user-defined categories, shown as the "Tasks" mode of the Clutter tab. Separate from Brain Clutter notes.

## Architecture
- `api/` — categories, tasks, and AI expand/review calls under `/api/brain-clutter/tasks/...`.
- `hooks/useTaskCategories`, `useCategoryTasks` — CRUD with soft-locked errors.
- `hooks/useExpandTasks` — paste → preview (nothing saved) → accept.
- `hooks/useReviewTasks` — review → preview splits → apply the selected ones.
- `components/TaskReorderSheet` — `POST /tasks/reorder` previews an order. Apply is `POST /tasks/reorder/apply` and replaces that category's task list. Fewer than two open tasks leaves the button off.
- `store/focusTimer.store` + `hooks/useFocusTimer` — client-only 1–180 min timer (zustand). Closing the sheet unmounts it, which stops and resets the timer.
- `hooks/useSuggestedTask` + `components/SuggestedTaskCard` — Home asks `GET /tasks/suggestion` for one open task. Nothing is stored on the device. "Another task" sends `exclude`. Tapping the card opens Clutter in Tasks mode and does not complete the task.

## API dependencies
`/tasks/categories[/id][/tasks]` · `/tasks[/id]` · `/tasks/suggestion` · `/tasks/expand` · `/tasks/expand/accept` · `/tasks/review` · `/tasks/review/apply` · `/tasks/reorder` · `/tasks/reorder/apply`

## Known limitations
- Timer is not synced to the server and does not run in the background.
- No due dates. Open tasks can be reordered by AI. Completed tasks keep their place below the open ones.

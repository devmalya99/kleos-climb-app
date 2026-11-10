# Task Manager

Tasks inside user-defined categories. Shown as the Tasks tab.

## Architecture
- `api/` — categories, tasks, suggestion, and AI expand/review/reorder under `/api/brain-clutter/tasks/...`.
- `screens/TasksScreen` — tab chrome with icon actions for rename, delete, and search.
- `screens/TaskManagerScreen` — categories, toolbar, and task list.
- Task row actions are icons: clock for focus, trash for delete, ellipsis for edit.
- `hooks/useSuggestedTask` + `components/SuggestedTaskCard` — Home suggestion for one open task.

## API dependencies
`/tasks/categories[/id][/tasks]` · `/tasks[/id]` · `/tasks/suggestion` · `/tasks/expand` · `/tasks/expand/accept` · `/tasks/review` · `/tasks/review/apply` · `/tasks/reorder` · `/tasks/reorder/apply`

## Known limitations
- Timer is client-only and does not run in the background.
- No due dates.

# NOTES.md

## Summary of changes

Fixed an operator-precedence bug in the task search query (`TaskRepository.java`, mirrored in `db/queries/search_tasks.sql` and `db/oracle/task_search_package.sql`) — missing parentheses let archived tasks leak into description matches and skipped the status filter on title matches. Removed an artificial `Thread.sleep` in `TaskController.java` adding up to 1s of latency on short/blank searches. Fixed `useTasks.js` getting stuck on "Loading..." forever after a failed request (missing `setLoading(false)` in `.catch`, no error reset on success). Added a 300ms debounce on the search input plus a request-id guard so out-of-order responses can't overwrite newer ones. Fixed `page` not resetting to 1 when the search term or status changes. Added validation so an invalid `status` returns a clean 400 instead of an unhandled 500. Added a `priority` filter end-to-end (enum, query, controller param, UI control). Replaced in-memory fetch-all-then-slice pagination with SQL-level `LIMIT`/`OFFSET` and a separate count query, and made page size user-configurable (5/10/20/50). Details and discovery process are in `handwritten/`.

## What I chose not to change

Left `System.out.println` logging as-is instead of introducing SLF4J, and didn't generalize validation into a `@ControllerAdvice`. Both are reasonable, but widen the diff beyond a focused patch for this timebox.

## Biggest remaining risk

The same query logic now lives in three places — `TaskRepository.java`, the SQL reference doc, and the Oracle package — with no single source of truth, making it easy for them to silently drift apart again, likely how the original bug happened.

## Tools/AI used

Used Claude to find the artificial blocking delay (Thread.sleep in TaskController.java) and the unvalidated status parameter that caused an unhandled exception. I reviewed and tested each suggestion before applying it — handwritten notes reflect my own understanding, not transcribed AI output.
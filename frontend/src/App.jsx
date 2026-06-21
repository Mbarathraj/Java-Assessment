import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import StatusFilter from "./components/StatusFilter";
import TaskTable from "./components/TaskTable";
import { useTasks } from "./hooks/useTasks";
import { useDebounce } from "./hooks/useDebounce";
import PageSize from "./components/PageSize";
import PriorityFilter from "./components/PriorityFilter";

export default function App() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [priority,setPriority]= useState("")
  const [page, setPage] = useState(1);
  const [pageSize,setPageSize]=useState(10)

  const debouncedQuery = useDebounce(query, 500);
  const { tasks, total, loading, error } = useTasks(
    debouncedQuery,
    status,
    page,
    pageSize,
    priority
  );

  useEffect(() => {
    console.log(priority)
    setPage(1);
  }, [debouncedQuery, status,priority]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Tracker</h1>
        <p className="subtitle">Internal task management</p>
      </header>

      <div className="controls">
        <SearchBar value={query} onChange={setQuery} />
        <PriorityFilter value={priority} onChange={setPriority}/>
        <StatusFilter value={status} onChange={setStatus} />
        <PageSize value={pageSize} onChange={setPageSize}/>
      </div>

      <TaskTable tasks={tasks} loading={loading} error={error} />

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

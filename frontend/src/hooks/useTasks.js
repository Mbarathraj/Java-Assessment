import { useState, useEffect, useRef } from "react";
import { fetchTasks } from "../api";

export function useTasks(query, status, page, pageSize,priority) {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  useEffect(() => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    console.log(status);

    fetchTasks({ query, status, page, pageSize,priority })
      .then((data) => {
        if (currentRequest != requestId.current) return;
        setTasks(data.items);
        setTotal(data.total);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        if (currentRequest !== requestId.current) return;
        setError(err.message);
        setLoading(false);
      });
  }, [query, status, page, pageSize,priority]);

  return { tasks, total, loading, error };
}

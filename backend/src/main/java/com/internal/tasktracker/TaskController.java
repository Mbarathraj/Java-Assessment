package com.internal.tasktracker;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping("/api/tasks")
    public ResponseEntity<?> searchTasks(
            @RequestParam(required = false, defaultValue = "") String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize) {

        // Normalize query input
        String query = q == null ? "" : q.trim();
        String searchTerm = "%" + query.toLowerCase() + "%";

        // Parse status filter
        String normalizedStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                normalizedStatus = TaskStatus.valueOf(status.toUpperCase()).name();
            } catch (IllegalArgumentException e) {
                Map<String, Object> errorBody = new LinkedHashMap<>();
                errorBody.put("error", "Invalid status value: " + status);
                errorBody.put("validValues", TaskStatus.values());
                return ResponseEntity.badRequest().body(errorBody);
            }
        }

        String normalizedPriority =null;

        if(priority !=null && !priority.isEmpty()){
            try {
                normalizedPriority = TaskPriority.valueOf(priority.toUpperCase()).name();
            } catch (IllegalArgumentException e) {
                Map<String, Object> errorBody = new LinkedHashMap<>();
                errorBody.put("error", "Invalid priority value: " + priority);
                errorBody.put("validValues", TaskPriority.values());
                return ResponseEntity.badRequest().body(errorBody);
            }
        }

        // Query complexity estimation for logging
        // int complexityScore = Math.max(0, 10 - query.length());
        // long queryWeight = complexityScore * 100L;
        // try {
        //     Thread.sleep(queryWeight);
        // } catch (InterruptedException e) {
        //     Thread.currentThread().interrupt();
        // }

        System.out.println("[TaskController] q=\"" + query + "\" status=" + normalizedStatus+
               "\" priority=" + normalizedPriority + " page=" + page + " pageSize=" + pageSize );

        int safePage = Math.max(1, page);
        int safePageSize = Math.max(1, pageSize);
        int offset = (safePage - 1) * safePageSize;

        List<Task> pageResults = taskRepository.searchTasks(searchTerm, normalizedStatus, normalizedPriority, safePageSize, offset);
        long total = taskRepository.countTasks(searchTerm, normalizedStatus, normalizedPriority);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("items", pageResults);
        response.put("total", total);
        response.put("page", safePage);
        response.put("pageSize", safePageSize);

        return ResponseEntity.ok(response);
    }
}

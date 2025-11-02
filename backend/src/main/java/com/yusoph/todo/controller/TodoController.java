package com.yusoph.todo.controller;

import com.yusoph.todo.dto.TodoCreateRequest;
import com.yusoph.todo.dto.TodoResponse;
import com.yusoph.todo.dto.TodoUpdateRequest;
import com.yusoph.todo.entity.Todo;
import com.yusoph.todo.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TodoController {
    
    private final TodoService todoService;
    
    // GET /api/todos - Get all todos
    @GetMapping
    public ResponseEntity<List<TodoResponse>> getAllTodos(
            @RequestParam(required = false, defaultValue = "false") boolean orderByPriority) {
        log.info("GET /api/todos - orderByPriority: {}", orderByPriority);
        
        List<TodoResponse> todos = orderByPriority ? 
                todoService.getAllTodosOrderedByPriority() : 
                todoService.getAllTodos();
        
        return ResponseEntity.ok(todos);
    }
    
    // GET /api/todos/{id} - Get todo by ID
    @GetMapping("/{id}")
    public ResponseEntity<TodoResponse> getTodoById(@PathVariable Long id) {
        log.info("GET /api/todos/{}", id);
        TodoResponse todo = todoService.getTodoById(id);
        return ResponseEntity.ok(todo);
    }
    
    // GET /api/todos/completed/{completed} - Get todos by completion status
    @GetMapping("/completed/{completed}")
    public ResponseEntity<List<TodoResponse>> getTodosByCompleted(@PathVariable Boolean completed) {
        log.info("GET /api/todos/completed/{}", completed);
        List<TodoResponse> todos = todoService.getTodosByCompleted(completed);
        return ResponseEntity.ok(todos);
    }
    
    // GET /api/todos/priority/{priority} - Get todos by priority
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<TodoResponse>> getTodosByPriority(@PathVariable Todo.Priority priority) {
        log.info("GET /api/todos/priority/{}", priority);
        List<TodoResponse> todos = todoService.getTodosByPriority(priority);
        return ResponseEntity.ok(todos);
    }
    
    // GET /api/todos/search - Search todos by title
    @GetMapping("/search")
    public ResponseEntity<List<TodoResponse>> searchTodos(@RequestParam String title) {
        log.info("GET /api/todos/search?title={}", title);
        List<TodoResponse> todos = todoService.searchTodosByTitle(title);
        return ResponseEntity.ok(todos);
    }
    
    // GET /api/todos/overdue - Get overdue todos
    @GetMapping("/overdue")
    public ResponseEntity<List<TodoResponse>> getOverdueTodos() {
        log.info("GET /api/todos/overdue");
        List<TodoResponse> todos = todoService.getOverdueTodos();
        return ResponseEntity.ok(todos);
    }
    
    // GET /api/todos/stats - Get todo statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getTodoStats() {
        log.info("GET /api/todos/stats");
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", todoService.getTodoCount());
        stats.put("completed", todoService.getCompletedTodoCount());
        stats.put("pending", todoService.getPendingTodoCount());
        stats.put("highPriority", todoService.getHighPriorityTodoCount());
        stats.put("mediumPriority", todoService.getMediumPriorityTodoCount());
        stats.put("lowPriority", todoService.getLowPriorityTodoCount());
        return ResponseEntity.ok(stats);
    }
    
    // POST /api/todos - Create a new todo
    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(@Valid @RequestBody TodoCreateRequest request) {
        log.info("POST /api/todos - Creating todo with title: {}", request.getTitle());
        TodoResponse createdTodo = todoService.createTodo(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTodo);
    }
    
    // PUT /api/todos/{id} - Update a todo
    @PutMapping("/{id}")
    public ResponseEntity<TodoResponse> updateTodo(@PathVariable Long id, 
                                                   @Valid @RequestBody TodoUpdateRequest request) {
        log.info("PUT /api/todos/{} - Updating todo", id);
        TodoResponse updatedTodo = todoService.updateTodo(id, request);
        return ResponseEntity.ok(updatedTodo);
    }
    
    // PATCH /api/todos/{id}/complete - Mark todo as completed
    @PatchMapping("/{id}/complete")
    public ResponseEntity<TodoResponse> markTodoAsCompleted(@PathVariable Long id) {
        log.info("PATCH /api/todos/{}/complete - Marking as completed", id);
        TodoResponse updatedTodo = todoService.markAsCompleted(id);
        return ResponseEntity.ok(updatedTodo);
    }
    
    // PATCH /api/todos/{id}/incomplete - Mark todo as incomplete
    @PatchMapping("/{id}/incomplete")
    public ResponseEntity<TodoResponse> markTodoAsIncomplete(@PathVariable Long id) {
        log.info("PATCH /api/todos/{}/incomplete - Marking as incomplete", id);
        TodoResponse updatedTodo = todoService.markAsIncomplete(id);
        return ResponseEntity.ok(updatedTodo);
    }
    
    // PATCH /api/todos/{id}/toggle - Toggle todo completion status
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TodoResponse> toggleTodoCompletion(@PathVariable Long id) {
        log.info("PATCH /api/todos/{}/toggle - Toggling completion status", id);
        TodoResponse currentTodo = todoService.getTodoById(id);
        TodoResponse updatedTodo = Boolean.TRUE.equals(currentTodo.getCompleted()) ? 
                todoService.markAsIncomplete(id) : 
                todoService.markAsCompleted(id);
        return ResponseEntity.ok(updatedTodo);
    }
    
    // DELETE /api/todos/{id} - Delete a todo
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTodo(@PathVariable Long id) {
        log.info("DELETE /api/todos/{} - Deleting todo", id);
        todoService.deleteTodo(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Todo deleted successfully");
        response.put("deletedId", id.toString());
        
        return ResponseEntity.ok(response);
    }
    
    // DELETE /api/todos/completed - Delete all completed todos
    @DeleteMapping("/completed")
    public ResponseEntity<Map<String, String>> deleteAllCompletedTodos() {
        log.info("DELETE /api/todos/completed - Deleting all completed todos");
        todoService.deleteAllCompletedTodos();
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "All completed todos deleted successfully");
        
        return ResponseEntity.ok(response);
    }
}
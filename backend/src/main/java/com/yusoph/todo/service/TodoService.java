package com.yusoph.todo.service;

import com.yusoph.todo.dto.TodoCreateRequest;
import com.yusoph.todo.dto.TodoResponse;
import com.yusoph.todo.dto.TodoUpdateRequest;
import com.yusoph.todo.entity.Todo;
import com.yusoph.todo.exception.TodoNotFoundException;
import com.yusoph.todo.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TodoService {
    
    private final TodoRepository todoRepository;
    
    @Transactional(readOnly = true)
    public List<TodoResponse> getAllTodos() {
        log.debug("Fetching all todos");
        return todoRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(TodoResponse::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TodoResponse> getAllTodosOrderedByPriority() {
        log.debug("Fetching all todos ordered by priority and due date");
        return todoRepository.findAllOrderedByPriorityAndDueDate()
                .stream()
                .map(TodoResponse::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public TodoResponse getTodoById(Long id) {
        log.debug("Fetching todo with id: {}", id);
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));
        return new TodoResponse(todo);
    }
    
    @Transactional(readOnly = true)
    public List<TodoResponse> getTodosByCompleted(Boolean completed) {
        log.debug("Fetching todos by completed status: {}", completed);
        return todoRepository.findByCompleted(completed)
                .stream()
                .map(TodoResponse::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TodoResponse> getTodosByPriority(Todo.Priority priority) {
        log.debug("Fetching todos by priority: {}", priority);
        return todoRepository.findByPriority(priority)
                .stream()
                .map(TodoResponse::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TodoResponse> searchTodosByTitle(String title) {
        log.debug("Searching todos by title containing: {}", title);
        return todoRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(TodoResponse::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TodoResponse> getOverdueTodos() {
        log.debug("Fetching overdue todos");
        return todoRepository.findOverdueTodos(LocalDateTime.now())
                .stream()
                .map(TodoResponse::new)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public TodoResponse createTodo(TodoCreateRequest request) {
        log.debug("Creating new todo with title: {}", request.getTitle());
        
        Todo todo = new Todo(
                request.getTitle(),
                request.getDescription(),
                request.getCompleted(),
                request.getPriority(),
                request.getDueDate()
        );
        
        Todo savedTodo = todoRepository.save(todo);
        log.info("Created todo with id: {}", savedTodo.getId());
        return new TodoResponse(savedTodo);
    }
    
    @Transactional
    public TodoResponse updateTodo(Long id, TodoUpdateRequest request) {
        log.debug("Updating todo with id: {}", id);
        
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));
        
        // Update only non-null fields
        if (request.getTitle() != null) {
            todo.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            todo.setDescription(request.getDescription());
        }
        if (request.getCompleted() != null) {
            todo.setCompleted(request.getCompleted());
        }
        if (request.getPriority() != null) {
            todo.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            todo.setDueDate(request.getDueDate());
        }
        
        Todo updatedTodo = todoRepository.save(todo);
        log.info("Updated todo with id: {}", updatedTodo.getId());
        return new TodoResponse(updatedTodo);
    }
    
    @Transactional
    public TodoResponse markAsCompleted(Long id) {
        log.debug("Marking todo as completed with id: {}", id);
        
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));
        
        todo.setCompleted(true);
        Todo updatedTodo = todoRepository.save(todo);
        log.info("Marked todo as completed with id: {}", updatedTodo.getId());
        return new TodoResponse(updatedTodo);
    }
    
    @Transactional
    public TodoResponse markAsIncomplete(Long id) {
        log.debug("Marking todo as incomplete with id: {}", id);
        
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));
        
        todo.setCompleted(false);
        Todo updatedTodo = todoRepository.save(todo);
        log.info("Marked todo as incomplete with id: {}", updatedTodo.getId());
        return new TodoResponse(updatedTodo);
    }
    
    @Transactional
    public void deleteTodo(Long id) {
        log.debug("Deleting todo with id: {}", id);
        
        if (!todoRepository.existsById(id)) {
            throw new TodoNotFoundException(id);
        }
        
        todoRepository.deleteById(id);
        log.info("Deleted todo with id: {}", id);
    }
    
    @Transactional
    public void deleteAllCompletedTodos() {
        log.debug("Deleting all completed todos");
        List<Todo> completedTodos = todoRepository.findByCompleted(true);
        todoRepository.deleteAll(completedTodos);
        log.info("Deleted {} completed todos", completedTodos.size());
    }
    
    @Transactional(readOnly = true)
    public long getTodoCount() {
        return todoRepository.count();
    }
    
    @Transactional(readOnly = true)
    public long getCompletedTodoCount() {
        return todoRepository.countByCompleted(true);
    }
    
    @Transactional(readOnly = true)
    public long getPendingTodoCount() {
        return todoRepository.countByCompleted(false);
    }
    
    @Transactional(readOnly = true)
    public long getHighPriorityTodoCount() {
        return todoRepository.countByPriority(Todo.Priority.HIGH);
    }
    
    @Transactional(readOnly = true)
    public long getMediumPriorityTodoCount() {
        return todoRepository.countByPriority(Todo.Priority.MEDIUM);
    }
    
    @Transactional(readOnly = true)
    public long getLowPriorityTodoCount() {
        return todoRepository.countByPriority(Todo.Priority.LOW);
    }
}
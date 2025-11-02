package com.yusoph.todo.service;

import com.yusoph.todo.dto.TodoCreateRequest;
import com.yusoph.todo.dto.TodoResponse;
import com.yusoph.todo.dto.TodoUpdateRequest;
import com.yusoph.todo.entity.Todo;
import com.yusoph.todo.entity.User;
import com.yusoph.todo.exception.TodoNotFoundException;
import com.yusoph.todo.exception.UserNotFoundException;
import com.yusoph.todo.repository.TodoRepository;
import com.yusoph.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserRepository userRepository;
    
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
    }
    
    private boolean isAdmin(User user) {
        return User.Role.ADMIN.equals(user.getRole());
    }
    
    private void validateTodoOwnership(Todo todo, User user) {
        if (isAdmin(user)) {
            return; // Admins can access all todos
        }
        if (!todo.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have permission to access this todo");
        }
    }
    
    @Transactional(readOnly = true)
    public List<TodoResponse> getAllTodos() {
        User user = getCurrentUser();
        System.out.println("DEBUG: Fetching all todos for user: " + user.getUsername() + " with role: " + user.getRole());
        log.debug("Fetching all todos for user: {} with role: {}", user.getUsername(), user.getRole());
        
        // Admins can see all todos
        boolean isUserAdmin = isAdmin(user);
        System.out.println("DEBUG: Is user admin? " + isUserAdmin);
        log.debug("Is user admin? {}", isUserAdmin);
        
        if (isUserAdmin) {
            System.out.println("DEBUG: User is admin, fetching all todos from all users");
            log.debug("User is admin, fetching all todos from all users");
            List<Todo> allTodos = todoRepository.findAll();
            System.out.println("DEBUG: Found " + allTodos.size() + " todos");
            return allTodos.stream()
                    .map(TodoResponse::new)
                    .collect(Collectors.toList());
        }
        
        System.out.println("DEBUG: User is not admin, fetching only user's todos");
        log.debug("User is not admin, fetching only user's todos");
        return todoRepository.findByUserId(user.getId())
                .stream()
                .map(TodoResponse::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TodoResponse> getAllTodosOrderedByPriority() {
        User user = getCurrentUser();
        log.debug("Fetching all todos ordered by priority and due date for user: {}", user.getUsername());
        
        // Admins can see all todos
        if (isAdmin(user)) {
            log.debug("User is admin, fetching all todos from all users ordered by priority");
            return todoRepository.findAll(Sort.by(Sort.Direction.DESC, "priority")
                            .and(Sort.by(Sort.Direction.ASC, "dueDate")))
                    .stream()
                    .map(TodoResponse::new)
                    .collect(Collectors.toList());
        }
        
        return todoRepository.findAllByUserIdOrderedByPriorityAndDueDate(user.getId())
                .stream()
                .map(TodoResponse::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public TodoResponse getTodoById(Long id) {
        User user = getCurrentUser();
        log.debug("Fetching todo with id: {} for user: {}", id, user.getUsername());
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));
        validateTodoOwnership(todo, user);
        return new TodoResponse(todo);
    }
    
    @Transactional(readOnly = true)
    public List<TodoResponse> getTodosByCompleted(Boolean completed) {
        User user = getCurrentUser();
        log.debug("Fetching todos by completed status: {} for user: {}", completed, user.getUsername());
        return todoRepository.findByUserIdAndCompleted(user.getId(), completed)
                .stream()
                .map(TodoResponse::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TodoResponse> getTodosByPriority(Todo.Priority priority) {
        User user = getCurrentUser();
        log.debug("Fetching todos by priority: {} for user: {}", priority, user.getUsername());
        return todoRepository.findByUserIdAndPriority(user.getId(), priority)
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
        User user = getCurrentUser();
        log.debug("Creating new todo with title: {} for user: {}", request.getTitle(), user.getUsername());
        
        Todo todo = new Todo(
                request.getTitle(),
                request.getDescription(),
                request.getCompleted(),
                request.getPriority(),
                request.getDueDate()
        );
        todo.setUser(user);
        
        Todo savedTodo = todoRepository.save(todo);
        log.info("Created todo with id: {} for user: {}", savedTodo.getId(), user.getUsername());
        return new TodoResponse(savedTodo);
    }
    
    @Transactional
    public TodoResponse updateTodo(Long id, TodoUpdateRequest request) {
        User user = getCurrentUser();
        log.debug("Updating todo with id: {} for user: {}", id, user.getUsername());
        
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));
        validateTodoOwnership(todo, user);
        
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
        User user = getCurrentUser();
        log.debug("Marking todo as completed with id: {} for user: {}", id, user.getUsername());
        
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));
        validateTodoOwnership(todo, user);
        
        todo.setCompleted(true);
        Todo updatedTodo = todoRepository.save(todo);
        log.info("Marked todo as completed with id: {}", updatedTodo.getId());
        return new TodoResponse(updatedTodo);
    }
    
    @Transactional
    public TodoResponse markAsIncomplete(Long id) {
        User user = getCurrentUser();
        log.debug("Marking todo as incomplete with id: {} for user: {}", id, user.getUsername());
        
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));
        validateTodoOwnership(todo, user);
        
        todo.setCompleted(false);
        Todo updatedTodo = todoRepository.save(todo);
        log.info("Marked todo as incomplete with id: {}", updatedTodo.getId());
        return new TodoResponse(updatedTodo);
    }
    
    @Transactional
    public void deleteTodo(Long id) {
        User user = getCurrentUser();
        log.debug("Deleting todo with id: {} for user: {}", id, user.getUsername());
        
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));
        validateTodoOwnership(todo, user);
        
        todoRepository.deleteById(id);
        log.info("Deleted todo with id: {}", id);
    }
    
    @Transactional
    public void deleteAllCompletedTodos() {
        User user = getCurrentUser();
        log.debug("Deleting all completed todos for user: {}", user.getUsername());
        List<Todo> completedTodos = todoRepository.findByUserIdAndCompleted(user.getId(), true);
        todoRepository.deleteAll(completedTodos);
        log.info("Deleted {} completed todos for user: {}", completedTodos.size(), user.getUsername());
    }
    
    @Transactional(readOnly = true)
    public long getTodoCount() {
        User user = getCurrentUser();
        if (isAdmin(user)) {
            return todoRepository.count();
        }
        return todoRepository.findByUserId(user.getId()).size();
    }
    
    @Transactional(readOnly = true)
    public long getCompletedTodoCount() {
        User user = getCurrentUser();
        if (isAdmin(user)) {
            return todoRepository.countByCompleted(true);
        }
        return todoRepository.countByUserIdAndCompleted(user.getId(), true);
    }
    
    @Transactional(readOnly = true)
    public long getPendingTodoCount() {
        User user = getCurrentUser();
        if (isAdmin(user)) {
            return todoRepository.countByCompleted(false);
        }
        return todoRepository.countByUserIdAndCompleted(user.getId(), false);
    }
    
    @Transactional(readOnly = true)
    public long getHighPriorityTodoCount() {
        User user = getCurrentUser();
        if (isAdmin(user)) {
            return todoRepository.countByPriority(Todo.Priority.HIGH);
        }
        return todoRepository.countByUserIdAndPriority(user.getId(), Todo.Priority.HIGH);
    }
    
    @Transactional(readOnly = true)
    public long getMediumPriorityTodoCount() {
        User user = getCurrentUser();
        if (isAdmin(user)) {
            return todoRepository.countByPriority(Todo.Priority.MEDIUM);
        }
        return todoRepository.countByUserIdAndPriority(user.getId(), Todo.Priority.MEDIUM);
    }
    
    @Transactional(readOnly = true)
    public long getLowPriorityTodoCount() {
        User user = getCurrentUser();
        if (isAdmin(user)) {
            return todoRepository.countByPriority(Todo.Priority.LOW);
        }
        return todoRepository.countByUserIdAndPriority(user.getId(), Todo.Priority.LOW);
    }
}
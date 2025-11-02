package com.yusoph.todo.dto;

import com.yusoph.todo.entity.Todo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TodoResponse {
    
    private Long id;
    private String title;
    private String description;
    private Boolean completed;
    private Todo.Priority priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime dueDate;
    
    // Constructor from Todo entity
    public TodoResponse(Todo todo) {
        this.id = todo.getId();
        this.title = todo.getTitle();
        this.description = todo.getDescription();
        this.completed = todo.getCompleted();
        this.priority = todo.getPriority();
        this.createdAt = todo.getCreatedAt();
        this.updatedAt = todo.getUpdatedAt();
        this.dueDate = todo.getDueDate();
    }
}
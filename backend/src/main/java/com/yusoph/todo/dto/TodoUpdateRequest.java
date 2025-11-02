package com.yusoph.todo.dto;

import com.yusoph.todo.entity.Todo;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TodoUpdateRequest {
    
    @Size(max = 200, message = "Title must be less than 200 characters")
    private String title;
    
    @Size(max = 1000, message = "Description must be less than 1000 characters")
    private String description;
    
    private Boolean completed;
    
    private Todo.Priority priority;
    
    private LocalDateTime dueDate;
}
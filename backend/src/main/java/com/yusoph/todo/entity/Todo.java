package com.yusoph.todo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "todos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Todo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is mandatory")
    @Size(max = 200, message = "Title must be less than 200 characters")
    @Column(nullable = false)
    private String title;
    
    @Size(max = 1000, message = "Description must be less than 1000 characters")
    @Column(length = 1000)
    private String description;
    
    @NotNull(message = "Completed status is mandatory")
    @Column(nullable = false)
    private Boolean completed = false;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "due_date")
    private LocalDateTime dueDate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    public enum Priority {
        LOW, MEDIUM, HIGH
    }
    
    // Constructor without id for creating new todos
    public Todo(String title, String description, Boolean completed, Priority priority, LocalDateTime dueDate) {
        this.title = title;
        this.description = description;
        this.completed = completed != null ? completed : false;
        this.priority = priority != null ? priority : Priority.MEDIUM;
        this.dueDate = dueDate;
    }
}
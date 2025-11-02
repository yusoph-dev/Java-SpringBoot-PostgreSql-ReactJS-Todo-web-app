package com.yusoph.todo.repository;

import com.yusoph.todo.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    
    // Find todos by completion status
    List<Todo> findByCompleted(Boolean completed);
    
    // Find todos by priority
    List<Todo> findByPriority(Todo.Priority priority);
    
    // Find todos by title containing (case insensitive)
    List<Todo> findByTitleContainingIgnoreCase(String title);
    
    // Find todos by completion status and priority
    List<Todo> findByCompletedAndPriority(Boolean completed, Todo.Priority priority);
    
    // Find todos due before a specific date
    List<Todo> findByDueDateBefore(LocalDateTime dueDate);
    
    // Find overdue todos (not completed and due date passed)
    @Query("SELECT t FROM Todo t WHERE t.completed = false AND t.dueDate < :currentDate")
    List<Todo> findOverdueTodos(@Param("currentDate") LocalDateTime currentDate);
    
    // Find todos created between dates
    @Query("SELECT t FROM Todo t WHERE t.createdAt BETWEEN :startDate AND :endDate ORDER BY t.createdAt DESC")
    List<Todo> findTodosCreatedBetween(@Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate);
    
    // Count todos by completion status
    long countByCompleted(Boolean completed);
    
    // Count todos by priority
    long countByPriority(Todo.Priority priority);
    
    // Find all todos ordered by priority and due date
    @Query("SELECT t FROM Todo t ORDER BY " +
           "CASE WHEN t.priority = 'HIGH' THEN 1 " +
           "     WHEN t.priority = 'MEDIUM' THEN 2 " +
           "     WHEN t.priority = 'LOW' THEN 3 END, " +
           "t.dueDate ASC NULLS LAST, t.createdAt ASC")
    List<Todo> findAllOrderedByPriorityAndDueDate();
}
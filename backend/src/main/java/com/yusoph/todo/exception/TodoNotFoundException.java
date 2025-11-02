package com.yusoph.todo.exception;

public class TodoNotFoundException extends RuntimeException {
    public TodoNotFoundException(Long id) {
        super("Todo not found with id: " + id);
    }
    
    public TodoNotFoundException(String message) {
        super(message);
    }
}
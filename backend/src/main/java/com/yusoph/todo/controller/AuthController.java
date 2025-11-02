package com.yusoph.todo.controller;

import com.yusoph.todo.dto.AuthResponse;
import com.yusoph.todo.dto.LoginRequest;
import com.yusoph.todo.dto.RegisterRequest;
import com.yusoph.todo.dto.UpdateUserRequest;
import com.yusoph.todo.dto.UserResponse;
import com.yusoph.todo.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * Register a new user
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Login user
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Logout user (client-side token removal)
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        // JWT tokens are stateless, so logout is handled client-side by removing the token
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
    
    /**
     * Get current authenticated user
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        UserResponse response = authService.getCurrentUser();
        return ResponseEntity.ok(response);
    }
    
    /**
     * Update current user profile
     */
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateUser(@Valid @RequestBody UpdateUserRequest request) {
        UserResponse response = authService.updateUser(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Delete current user account
     */
    @DeleteMapping("/me")
    public ResponseEntity<Map<String, String>> deleteAccount() {
        authService.deleteAccount();
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }
}

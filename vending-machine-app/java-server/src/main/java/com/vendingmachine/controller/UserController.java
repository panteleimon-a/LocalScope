package com.vendingmachine.controller;

import com.vendingmachine.dto.RegisterRequest;
import com.vendingmachine.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Object loginRequest) {
        // TODO: Implement login logic
        return ResponseEntity.ok("Login endpoint");
    }

    @PostMapping
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            var user = userService.register(registerRequest);
            return ResponseEntity.status(201).body(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable String id) {
        // TODO: Implement get user by id
        return ResponseEntity.ok("Get user " + id);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        // TODO: Implement get profile
        return ResponseEntity.ok("Get profile");
    }

    @PutMapping("/profile/deposit")
    public ResponseEntity<?> deposit(@RequestBody Object depositRequest) {
        // TODO: Implement deposit logic
        return ResponseEntity.ok("Deposit endpoint");
    }

    @PutMapping("/profile/reset")
    public ResponseEntity<?> resetDeposit() {
        // TODO: Implement reset deposit logic
        return ResponseEntity.ok("Reset deposit endpoint");
    }

    @PostMapping("/purchase")
    public ResponseEntity<?> purchase(@RequestBody Object purchaseRequest) {
        // TODO: Implement purchase logic
        return ResponseEntity.ok("Purchase endpoint");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // TODO: Implement logout logic
        return ResponseEntity.ok("Logout endpoint");
    }
}

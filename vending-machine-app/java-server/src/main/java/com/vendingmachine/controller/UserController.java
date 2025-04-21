package com.vendingmachine.controller;

import com.vendingmachine.dto.RegisterRequest;
import com.vendingmachine.dto.LoginRequest;
import com.vendingmachine.dto.DepositRequest;
import com.vendingmachine.dto.PurchaseRequest;
import com.vendingmachine.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        // authHeader is expected to be "Bearer <jwt>", where <jwt> is a JWT string
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                userService.validateToken(authHeader.substring(7));
                return ResponseEntity.badRequest().body(Map.of("message", "User already logged in"));
            } catch (RuntimeException e) {
                if (!e.getMessage().contains("expired")) {
                    // continue login
                }
            }
        }
        try {
            String jwtToken = userService.login(loginRequest);
            return ResponseEntity.ok(Map.of("token", jwtToken));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        // authHeader is expected to be "Bearer <jwt>"
        try {
            userService.logoutUser(authHeader);
            return ResponseEntity.ok(Map.of("message", "Logout successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(Map.of("message", "Logout successful"));
        }
    }

    @PostMapping
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            var user = userService.register(registerRequest);
            return ResponseEntity.status(201).body(Map.of("message", "User registered successfully", "userId", user.getId()));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("exists")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
            }
            return ResponseEntity.status(500).body(Map.of("message", "Server error during registration"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id, @RequestHeader("Authorization") String authHeader) {
        // authHeader is expected to be "Bearer <jwt>"
        try {
            var user = userService.getProfile(authHeader);
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("message", "User not found"));
            }
            if (!user.get("Id").toString().equals(id)) {
                return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));
            }
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && msg.contains("Invalid user ID")) {
                return ResponseEntity.badRequest().body(Map.of("message", msg));
            }
            return ResponseEntity.status(401).body(Map.of("message", msg != null ? msg : "Unauthorized"));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        // authHeader is expected to be "Bearer <jwt>"
        try {
            var user = userService.getProfile(authHeader);
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("message", "User not found"));
            }
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && msg.contains("Invalid user ID")) {
                return ResponseEntity.badRequest().body(Map.of("message", msg));
            }
            return ResponseEntity.status(401).body(Map.of("message", msg != null ? msg : "Unauthorized"));
        }
    }

    @PutMapping("/profile/deposit")
    public ResponseEntity<?> deposit(@RequestHeader("Authorization") String authHeader, @RequestBody DepositRequest depositRequest) {
        // authHeader is expected to be "Bearer <jwt>"
        try {
            int deposit = depositRequest.getDeposit();
            List<Integer> allowed = List.of(5, 10, 20, 50, 100);
            if (deposit < 0 || !allowed.contains(deposit)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid coin value. Allowed coins are: 5, 10, 20, 50, 100."));
            }
            var updatedUser = userService.addDeposit(authHeader, depositRequest);
            return ResponseEntity.ok(Map.of("message", "Deposit added successfully", "user", updatedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/profile/reset")
    public ResponseEntity<?> resetDeposit(@RequestHeader("Authorization") String authHeader) {
        // authHeader is expected to be "Bearer <jwt>"
        try {
            var updatedUser = userService.resetDeposit(authHeader);
            return ResponseEntity.ok(Map.of("message", "Deposit returned successfully", "user", updatedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/purchase")
    public ResponseEntity<?> purchase(@RequestHeader("Authorization") String authHeader, @RequestBody PurchaseRequest purchaseRequest) {
        // authHeader is expected to be "Bearer <jwt>"
        try {
            var order = userService.purchaseProducts(authHeader, purchaseRequest);
            return ResponseEntity.status(201).body(Map.of("message", "Order created successfully", "orderId", order.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }
}

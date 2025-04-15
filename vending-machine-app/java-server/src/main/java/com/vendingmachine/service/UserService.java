package com.vendingmachine.service;

import com.vendingmachine.dto.*;
import com.vendingmachine.model.*;
import com.vendingmachine.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private OrderRepository orderRepository;

    @Value("${jwt.secret}")
    private String jwtSecret;

    public String login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername());
        if (user == null || !BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("username", user.getUsername());
        userMap.put("role", user.getRole());
        Map<String, Object> claims = new HashMap<>();
        claims.put("user", userMap);
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(new Date(System.currentTimeMillis() + 3600_000))
                .signWith(SignatureAlgorithm.HS256, jwtSecret.getBytes())
                .compact();
    }

    public User register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()));
        user.setRole(request.getRole() != null ? request.getRole() : "buyer");
        user.setDeposit(0);
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        User user = userRepository.findById(id);
        if (user == null) throw new RuntimeException("User not found");
        return user;
    }

    public User getProfile(Long userId) {
        return getUserById(userId);
    }

    public User deposit(Long userId, DepositRequest request) {
        int deposit = request.getDeposit();
        List<Integer> allowed = Arrays.asList(5, 10, 20, 50, 100);
        if (!allowed.contains(deposit)) {
            throw new RuntimeException("Invalid coin value. Allowed: 5, 10, 20, 50, 100.");
        }
        User user = getUserById(userId);
        userRepository.updateDeposit(userId, user.getDeposit() + deposit);
        return userRepository.findById(userId);
    }

    public User resetDeposit(Long userId) {
        userRepository.resetDeposit(userId);
        return userRepository.findById(userId);
    }

    @Transactional
    public Map<String, Object> purchase(Long userId, PurchaseRequest request) {
        User user = getUserById(userId);
        int totalPrice = 0;
        Map<Long, Integer> productQuantities = new HashMap<>();
        for (PurchaseRequest.ProductPurchase p : request.getProducts()) {
            Product prod = productRepository.findById(p.getId());
            if (prod == null) throw new RuntimeException("Invalid product ID: " + p.getId());
            if (p.getQuantity() > prod.getAmountAvailable()) throw new RuntimeException("Insufficient stock for product " + p.getId());
            totalPrice += prod.getCost() * p.getQuantity();
            productQuantities.put(p.getId(), p.getQuantity());
        }
        if (user.getDeposit() < totalPrice) throw new RuntimeException("Insufficient deposit");
        // Update inventory
        for (Map.Entry<Long, Integer> entry : productQuantities.entrySet()) {
            Product prod = productRepository.findById(entry.getKey());
            prod.setAmountAvailable(prod.getAmountAvailable() - entry.getValue());
            productRepository.update(prod.getId(), prod);
        }
        // Create order
        Long orderId = orderRepository.createOrder(userId, totalPrice);
        for (PurchaseRequest.ProductPurchase p : request.getProducts()) {
            Product prod = productRepository.findById(p.getId());
            orderRepository.addOrderItem(orderId, p.getId(), p.getQuantity(), prod.getCost());
        }
        // Update deposit
        userRepository.updateDeposit(userId, user.getDeposit() - totalPrice);
        Map<String, Object> result = new HashMap<>();
        result.put("orderId", orderId);
        result.put("message", "Order created successfully");

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("username", user.getUsername());
        userMap.put("role", user.getRole());
        result.put("user", userMap);

        return result;
    }
}

package com.vendingmachine.service;

import com.vendingmachine.dto.*;
import com.vendingmachine.model.*;
import com.vendingmachine.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.*;
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

    // In-memory token blacklist (for demonstration, not production)
    private final Set<String> tokenBlacklist = new HashSet<>();

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

    // Should return User
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

    public User getUserById(String id) {
        Long userId;
        try {
            userId = Long.parseLong(id);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid user ID");
        }
        User user = userRepository.findById(userId);
        if (user == null) throw new RuntimeException("User not found");
        return user;
    }

    // Helper to extract userId from JWT token in the Authorization header
    // Expects authHeader to be "Bearer <jwt>"
    private Long extractUserIdFromAuthHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Unauthorized");
        }
        String token = authHeader.substring(7);
        if (tokenBlacklist.contains(token)) {
            throw new RuntimeException("Token is blacklisted");
        }
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(jwtSecret.getBytes())
                    .parseClaimsJws(token)
                    .getBody();
            Map<String, Object> userMap = (Map<String, Object>) claims.get("user");
            Object idObj = userMap.get("id");
            if (idObj instanceof Integer) {
                return ((Integer) idObj).longValue();
            } else if (idObj instanceof Long) {
                return (Long) idObj;
            } else if (idObj instanceof String) {
                return Long.parseLong((String) idObj);
            }
            throw new RuntimeException("Invalid token payload");
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Token expired");
        } catch (JwtException e) {
            throw new RuntimeException("Invalid token");
        }
    }

    // Validate JWT token (for /login endpoint logic)
    // Expects token to be a JWT string, not a JSON string
    public void validateToken(String token) {
        if (tokenBlacklist.contains(token)) {
            throw new RuntimeException("Token is blacklisted");
        }
        try {
            Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody();
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Token expired");
        } catch (JwtException e) {
            throw new RuntimeException("Invalid token");
        }
    }

    // Should return Map<String, Object>
    public Map<String, Object> getProfile(String authHeader) {
        Long userId = extractUserIdFromAuthHeader(authHeader);
        User user = getUserById(userId.toString());
        if (user == null) throw new RuntimeException("User not found");
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("Id", user.getId());
        userMap.put("Username", user.getUsername());
        userMap.put("Role", user.getRole());
        userMap.put("Deposit", user.getDeposit());
        // Do not include password
        return userMap;
    }

    // Should return Map<String, Object>
    public Map<String, Object> addDeposit(String authHeader, DepositRequest request) {
        Long userId = extractUserIdFromAuthHeader(authHeader);
        int deposit = request.getDeposit();
        List<Integer> allowed = Arrays.asList(5, 10, 20, 50, 100);
        if (!allowed.contains(deposit)) {
            throw new RuntimeException("Invalid coin value. Allowed coins are: 5, 10, 20, 50, 100.");
        }
        User user = getUserById(userId.toString());
        userRepository.updateDeposit(userId, user.getDeposit() + deposit);
        user = userRepository.findById(userId);
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("Id", user.getId());
        userMap.put("Username", user.getUsername());
        userMap.put("Role", user.getRole());
        userMap.put("Deposit", user.getDeposit());
        return userMap;
    }

    // Should return Map<String, Object>
    public Map<String, Object> resetDeposit(String authHeader) {
        Long userId = extractUserIdFromAuthHeader(authHeader);
        userRepository.resetDeposit(userId);
        User user = userRepository.findById(userId);
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("Id", user.getId());
        userMap.put("Username", user.getUsername());
        userMap.put("Role", user.getRole());
        userMap.put("Deposit", user.getDeposit());
        return userMap;
    }

    @Transactional
    // Should return Order
    public Order purchaseProducts(String authHeader, PurchaseRequest request) {
        Long userId = extractUserIdFromAuthHeader(authHeader);
        User user = getUserById(userId.toString());
        int totalPrice = 0;
        Map<Long, Integer> productQuantities = new HashMap<>();
        for (PurchaseRequest.ProductPurchase p : request.getProducts()) {
            Product prod = productRepository.findById(p.getId());
            if (prod == null) throw new RuntimeException("Invalid product ID: " + p.getId());
            if (p.getQuantity() > prod.getAmountAvailable()) throw new RuntimeException("Insufficient stock for product " + p.getId());
            totalPrice += prod.getCost() * p.getQuantity();
            productQuantities.put(p.getId(), p.getQuantity());
        }
        if (user.getDeposit() < totalPrice) throw new RuntimeException("Insufficient deposit to complete the purchase.");
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
        Order order = new Order();
        order.setId(orderId);
        // ...set other order fields if needed...
        return order;
    }

    public void logoutUser(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Unauthorized");
        }
        String token = authHeader.substring(7);
        tokenBlacklist.add(token);
    }

    // All public methods that take authHeader expect "Bearer <jwt>"
}

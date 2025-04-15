package com.vendingmachine.repository;

import com.vendingmachine.model.Order;
import com.vendingmachine.model.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class OrderRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Long createOrder(Long userId, int totalPrice) {
        jdbcTemplate.update(
            "INSERT INTO Orders (UserId, OrderDate, TotalPrice) VALUES (?, GETDATE(), ?)",
            userId, totalPrice
        );
        return jdbcTemplate.queryForObject("SELECT TOP 1 Id FROM Orders ORDER BY Id DESC", Long.class);
    }

    public void addOrderItem(Long orderId, Long productId, int quantity, int price) {
        jdbcTemplate.update(
            "INSERT INTO OrderItems (OrderId, ProductId, Quantity, Price) VALUES (?, ?, ?, ?)",
            orderId, productId, quantity, price
        );
    }
}

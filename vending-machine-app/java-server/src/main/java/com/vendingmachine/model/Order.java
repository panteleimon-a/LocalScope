package com.vendingmachine.model;

import java.util.Date;
import java.util.List;

public class Order {
    private Long id;
    private Long userId;
    private Date orderDate;
    private int totalPrice;
    private List<OrderItem> items;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}

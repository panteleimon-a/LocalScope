package com.vendingmachine.dto;

import java.util.List;

public class PurchaseRequest {
    private List<ProductPurchase> products;

    public List<ProductPurchase> getProducts() {
        return products;
    }
    public void setProducts(List<ProductPurchase> products) {
        this.products = products;
    }

    public static class ProductPurchase {
        private Long id;
        private int quantity;

        public Long getId() {
            return id;
        }
        public void setId(Long id) {
            this.id = id;
        }
        public int getQuantity() {
            return quantity;
        }
        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }
}

package com.vendingmachine.dto;

public class ProductRequest {
    private String productName;
    private int amountAvailable;
    private int cost;

    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }
    public int getAmountAvailable() {
        return amountAvailable;
    }
    public void setAmountAvailable(int amountAvailable) {
        this.amountAvailable = amountAvailable;
    }
    public int getCost() {
        return cost;
    }
    public void setCost(int cost) {
        this.cost = cost;
    }
}
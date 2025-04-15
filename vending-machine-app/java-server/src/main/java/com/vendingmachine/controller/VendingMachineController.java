package com.vendingmachine.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VendingMachineController {

    @GetMapping("/api/status")
    public String status() {
        return "Vending machine backend is running!";
    }
}

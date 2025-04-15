package com.vendingmachine.controller;
import com.vendingmachine.dto.ProductRequest;
import com.vendingmachine.model.Product;
import com.vendingmachine.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }

    @PostMapping
    public ResponseEntity<?> addProduct(
            @RequestBody ProductRequest productRequest,
            @AuthenticationPrincipal Object principal
    ) {
        Long sellerId = null;
        if (principal instanceof Map<?, ?> map && map.get("id") != null) {
            sellerId = ((Number) map.get("id")).longValue();
        }
        Product createdProduct = productService.createProduct(productRequest, sellerId);
        return ResponseEntity.status(201).body(createdProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest productRequest,
            @AuthenticationPrincipal Object principal
    ) {
        Long sellerId = null;
        if (principal instanceof Map<?, ?> map && map.get("id") != null) {
            sellerId = ((Number) map.get("id")).longValue();
        }
        Product updatedProduct = productService.updateProduct(id, productRequest, sellerId);
        if (updatedProduct == null) {
            return ResponseEntity.status(403).body("You are not authorized to update this product");
        }
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal Object principal
    ) {
        Long sellerId = null;
        if (principal instanceof Map<?, ?> map && map.get("id") != null) {
            sellerId = ((Number) map.get("id")).longValue();
        }
        boolean deleted = productService.deleteProduct(id, sellerId);
        if (!deleted) {
            return ResponseEntity.status(403).body("You are not authorized to delete this product");
        }
        return ResponseEntity.noContent().build();
    }
}

package com.vendingmachine.service;

import com.vendingmachine.dto.ProductRequest;
import com.vendingmachine.model.Product;
import com.vendingmachine.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product createProduct(ProductRequest productRequest, Long sellerId) {
        Product product = new Product();
        product.setProductName(productRequest.getProductName());
        product.setAmountAvailable(productRequest.getAmountAvailable());
        product.setCost(productRequest.getCost());
        product.setSellerId(sellerId);
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest productRequest, Long sellerId) {
        Product existing = productRepository.findById(id);
        if (existing == null || !existing.getSellerId().equals(sellerId)) {
            return null;
        }
        existing.setProductName(productRequest.getProductName());
        existing.setAmountAvailable(productRequest.getAmountAvailable());
        existing.setCost(productRequest.getCost());
        return productRepository.update(id, existing);
    }

    public boolean deleteProduct(Long id, Long sellerId) {
        Product existing = productRepository.findById(id);
        if (existing == null || !existing.getSellerId().equals(sellerId)) {
            return false;
        }
        productRepository.delete(id);
        return true;
    }
}

package com.vendingmachine.repository;

import com.vendingmachine.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class ProductRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Product> productRowMapper = new RowMapper<Product>() {
        @Override
        public Product mapRow(ResultSet rs, int rowNum) throws SQLException {
            Product p = new Product();
            p.setId(rs.getLong("Id"));
            p.setProductName(rs.getString("ProductName"));
            p.setAmountAvailable(rs.getInt("AmountAvailable"));
            p.setCost(rs.getInt("Cost"));
            p.setSellerId(rs.getLong("SellerId"));
            return p;
        }
    };

    public List<Product> findAll() {
        return jdbcTemplate.query("SELECT * FROM Products", productRowMapper);
    }

    public Product findById(Long id) {
        List<Product> list = jdbcTemplate.query("SELECT * FROM Products WHERE Id = ?", productRowMapper, id);
        return list.isEmpty() ? null : list.get(0);
    }

    public Product save(Product product) {
        jdbcTemplate.update(
            "INSERT INTO Products (ProductName, AmountAvailable, Cost, SellerId) VALUES (?, ?, ?, ?)",
            product.getProductName(), product.getAmountAvailable(), product.getCost(), product.getSellerId()
        );
        // Fetch the last inserted product (simplified, not safe for concurrency)
        return jdbcTemplate.queryForObject(
            "SELECT TOP 1 * FROM Products ORDER BY Id DESC", productRowMapper
        );
    }

    public Product update(Long id, Product product) {
        jdbcTemplate.update(
            "UPDATE Products SET ProductName = ?, AmountAvailable = ?, Cost = ? WHERE Id = ?",
            product.getProductName(), product.getAmountAvailable(), product.getCost(), id
        );
        return findById(id);
    }

    public int delete(Long id) {
        return jdbcTemplate.update("DELETE FROM Products WHERE Id = ?", id);
    }
}

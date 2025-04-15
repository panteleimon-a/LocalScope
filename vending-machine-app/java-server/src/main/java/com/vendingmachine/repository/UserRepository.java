package com.vendingmachine.repository;

import com.vendingmachine.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<User> userRowMapper = new RowMapper<User>() {
        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            User u = new User();
            u.setId(rs.getLong("Id"));
            u.setUsername(rs.getString("Username"));
            u.setPassword(rs.getString("Password"));
            u.setRole(rs.getString("Role"));
            u.setDeposit(rs.getInt("Deposit"));
            return u;
        }
    };

    public User findByUsername(String username) {
        List<User> list = jdbcTemplate.query("SELECT * FROM Users WHERE Username = ?", userRowMapper, username);
        return list.isEmpty() ? null : list.get(0);
    }

    public User findById(Long id) {
        List<User> list = jdbcTemplate.query("SELECT * FROM Users WHERE Id = ?", userRowMapper, id);
        return list.isEmpty() ? null : list.get(0);
    }

    public User save(User user) {
        jdbcTemplate.update(
            "INSERT INTO Users (Username, Password, Role) VALUES (?, ?, ?)",
            user.getUsername(), user.getPassword(), user.getRole()
        );
        return jdbcTemplate.queryForObject(
            "SELECT TOP 1 * FROM Users ORDER BY Id DESC", userRowMapper
        );
    }

    public void updateDeposit(Long id, int deposit) {
        jdbcTemplate.update("UPDATE Users SET Deposit = ? WHERE Id = ?", deposit, id);
    }

    public void resetDeposit(Long id) {
        jdbcTemplate.update("UPDATE Users SET Deposit = 0 WHERE Id = ?", id);
    }
}

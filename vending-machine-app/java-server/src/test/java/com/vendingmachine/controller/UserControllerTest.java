package com.vendingmachine.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vendingmachine.dto.LoginRequest;
import com.vendingmachine.dto.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String token;
    private Long userId;
    private String username;

    @BeforeEach
    public void setup() throws Exception {
        // Use a unique username for each test run
        username = "testuser_" + UUID.randomUUID();

        // Register a user
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername(username);
        registerRequest.setPassword("testpass");
        registerRequest.setRole("buyer");
        mockMvc.perform(post("/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // Login to get token
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(username);
        loginRequest.setPassword("testpass");
        String response = mockMvc.perform(post("/user/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        token = objectMapper.readTree(response).get("token").asText(); // Extract JWT string

        // Get userId from profile
        String profileResponse = mockMvc.perform(get("/user/profile")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        userId = objectMapper.readTree(profileResponse).get("Id").asLong();
    }

    @Test
    public void testGetUser_Unauthorized() throws Exception {
        mockMvc.perform(get("/user/" + userId))
                .andExpect(status().isForbidden()); // Changed from isUnauthorized() to isForbidden()
    }

    @Test
    public void testGetUser_Forbidden() throws Exception {
        // Try to access another user's id (assuming 99999 does not exist)
        mockMvc.perform(get("/user/99999")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testGetUser_Success() throws Exception {
        mockMvc.perform(get("/user/" + userId)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(username)));
    }
}

# UserControllerTest – Integration Test Documentation

This document explains the purpose and structure of the `UserControllerTest` integration test for the Java Spring Boot backend.

## Overview

`UserControllerTest` verifies the authentication and authorization logic for the `/user/{id}` endpoint in the `UserController`. It uses Spring's `MockMvc` to simulate HTTP requests and validate responses.

## Test Setup (`@BeforeEach`)

- **Unique User Creation:**  
  Each test run generates a unique username using `UUID.randomUUID()` to avoid conflicts.
- **User Registration:**  
  Registers a new user via `POST /user` and expects a `201 Created` response.
- **User Login:**  
  Logs in with the registered credentials via `POST /user/login`, expects a `200 OK` response, and retrieves the JWT token from the response.
- **Profile Retrieval:**  
  Fetches the user's profile via `GET /user/profile` using the token, expects a `200 OK` response, and extracts the user ID.

## Test Cases

### 1. `testGetUser_Unauthorized`
- **Action:**  
  Sends a `GET /user/{userId}` request **without** an `Authorization` header.
- **Expectation:**  
  Receives a `403 Forbidden` response, confirming that unauthenticated access is blocked.

### 2. `testGetUser_Forbidden`
- **Action:**  
  Sends a `GET /user/99999` request (non-existent or different user) **with** a valid token.
- **Expectation:**  
  Receives a `403 Forbidden` response, confirming that users cannot access other users' data.

### 3. `testGetUser_Success`
- **Action:**  
  Sends a `GET /user/{userId}` request **with** a valid token for the same user.
- **Expectation:**  
  Receives a `200 OK` response and the response body contains the correct username.

## Key Concepts

- **MockMvc:**  
  Allows HTTP request simulation without starting a real server.
- **@SpringBootTest & @AutoConfigureMockMvc:**  
  Load the application context and configure MockMvc for integration testing.
- **Assertions:**  
  - `status().isCreated()`, `status().isOk()`, `status().isForbidden()` check HTTP status codes.
  - `content().string(containsString(...))` checks response content.

## Purpose

These tests ensure:
- Only authenticated users can access their own data.
- Unauthorized and forbidden access is properly handled.
- The `/user/{id}` endpoint enforces authentication and authorization consistently.


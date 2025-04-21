# Vending Machine App - Backend

This is the backend component of the Vending Machine App, implemented in **Java (Spring Boot)**. It provides RESTful APIs for user authentication, product management, and purchase functionality.

## Features

* **Authentication:** Register, login, JWT-based authentication, and role-based access (buyer/seller).
* **User Management (Seller):** Sellers can view all users and logout all users.
* **Product Management (Seller):** Sellers can add, update, and delete products.
* **Purchase (Buyer):** Buyers can deposit coins, purchase products, and receive change.
* **Deposit/Reset (Buyer):** Buyers can deposit coins and reset their deposit.

## Technologies Used

* **Backend:** Java (Spring Boot), SQL Server

## Setup

1. Ensure Java 21+ and Maven are installed.
2. Configure your database connection in `src/main/resources/application.properties`.
3. Run the backend server:
    ```bash
    cd vending-machine-app/java-server
    mvn spring-boot:run
    ```
   The server will start on port 8080 by default.

## API Endpoints

* `POST /user/login`: Login user.
* `POST /user`: Register user.
* `GET /user/{id}`: Get user details (requires authentication).
* `GET /user/profile`: Get user profile (requires authentication).
* `PUT /user/profile/deposit`: Deposit coins (requires authentication).
* `PUT /user/profile/reset`: Reset deposit (requires authentication).
* `POST /user/purchase`: Purchase product (requires authentication).
* `POST /user/logout`: Logout user (requires authentication).
* `GET /products`: Get all products.
* `GET /products/{id}`: Get product details.
* `POST /products`: Add product (requires authentication, seller only).
* `PUT /products/{id}`: Update product (requires authentication, seller only).
* `DELETE /products/{id}`: Delete product (requires authentication, seller only).

## Usage

Start the backend server (`mvn spring-boot:run`).

## Testing Guidelines

The default testing framework is Spring Boot Test. See `doc/UserControllerTest.md` for more guidelines.

## Notes

* This README is for the backend only. See the project root README for full-stack setup and usage.
* Error handling and input validation could be improved.
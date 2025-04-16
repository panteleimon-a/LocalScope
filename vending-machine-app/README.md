# Vending Machine App

This application simulates a vending machine with user authentication, product management, and purchase functionality. It uses a client-server architecture with an HTML/JavaScript frontend and a backend implemented in **Java (Spring Boot)**.

## Features

* **Authentication:** Users can register and log in. Login provides a JWT token used for subsequent authorized requests. Roles are assigned (buyer/seller) which determine available actions.
* **User Management (Seller):** Sellers can view all registered users and logout all users.
* **Product Management (Seller):** Sellers can add, update, and delete products.
* **Purchase (Buyer):** Buyers can deposit coins and purchase products. The system tracks the deposited amount and handles change.
* **Deposit/Reset (Buyer):** Buyers can deposit coins and reset their deposit.
* **UI Updates:** The UI dynamically updates based on the user's role (buyer/seller) and login status.

## Technologies Used

* **Frontend:** HTML, JavaScript (React)
* **Backend:** Java (Spring Boot), SQL Server

## Setup

### Backend (Java Spring Boot):

1. Make sure you have Java 21+ and Maven installed.
2. Configure your database connection in `src/main/resources/application.properties`.
3. Run the backend server:
    ```bash
    cd vending-machine-app/java-server
    mvn spring-boot:run
    ```
   The server will start on port 8080 by default.

### Frontend:

1. Run your frontend application as usual (see your frontend documentation).

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

1. Start the backend server (`mvn spring-boot:run`).
2. Open your frontend (e.g., http://localhost:3001/) in your browser.
3. Register or log in.
4. If logged in as a seller, you can manage products and buy products.
5. If logged in as a buyer, you can deposit coins and buy products.

## Testing Guidelines

You can write and run tests using your preferred Java testing framework (e.g., JUnit, Spring Boot Test).

## Notes

* This README provides a general overview. Refer to the code for specific implementation details.
* The provided Java code assumes a specific backend API structure. You'll need to adapt your frontend if your backend is different.
* Error handling and input validation could be improved.
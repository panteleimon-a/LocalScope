# Vending Machine App

This application simulates a vending machine with user authentication, product management, and purchase functionality. It uses a client-server architecture with an HTML/JavaScript frontend and a backend (example provided is assumed to be Node.js/Express but could be any backend).

## Features

*   **Authentication:** Users can register and log in.  Login provides a token used for subsequent authorized requests. Roles are assigned (buyer/seller) which determine available actions.
*   **User Management (Seller):** Sellers can view all registered users and logout all users.
*   **Product Management (Seller):** Sellers can add, update, and delete products.
*   **Purchase (Buyer):** Buyers can deposit coins and purchase products. The system tracks the deposited amount and handles change.
*   **Deposit/Reset (Buyer):** Buyers can deposit coins and reset their deposit.
*   **UI Updates:** The UI dynamically updates based on the user's role (buyer/seller) and login status.

## Technologies Used

*   **Frontend:** HTML, JavaScript
*   **Backend:**  (Assumed Node.js with Express - the provided code snippet implies a backend API)

## Setup

1.  **Backend:**
    *   Set up your backend server (e.g., Node.js with Express).  You'll need endpoints for the API calls used by the frontend (login, register, get users, get products, add product, update product, delete product, deposit, buy, reset, logout, logout all).  The provided JavaScript code assumes a base URL of `http://localhost:3000`.
2.  **Frontend:**
    *   Open `client/index.html` in your web browser.

## API Endpoints (Example - Adapt to your actual backend)

*   `POST /login`: Login user.
*   `POST /user`: Register user.
*   `GET /user`: Get all users (requires authentication).
*   `GET /product`: Get all products.
*   `POST /product`: Add product (requires authentication).
*   `PUT /product/:id`: Update product (requires authentication).
*   `DELETE /product/:id`: Delete product (requires authentication).
*   `POST /deposit`: Deposit coins (requires authentication).
*   `POST /buy`: Buy product (requires authentication).
*   `POST /reset`: Reset deposit (requires authentication).
*   `POST /logout`: Logout user (requires authentication).
*   `POST /logout/all`: Logout all users (requires authentication).

## Usage

1.  Start the backend server.
2.  Open `client/index.html` in your browser.
3.  Register or log in.
4.  If logged in as a seller, you can manage products.
5.  If logged in as a buyer, you can deposit coins and buy products.

## Notes

*   This README provides a general overview. Refer to the code for specific implementation details.
*   The provided JavaScript code assumes a specific backend API structure. You'll need to adapt it if your backend is different.
*   Error handling and input validation could be improved.
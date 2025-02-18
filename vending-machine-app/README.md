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

*   **Frontend:** HTML, JavaScript (REACT)
*   **Backend:** Node.js with Express

## Setup

1.  **Backend:**
    *   Run `node server/app.js` to start the backend server.
2.  **Frontend:**
    *   Run `node client/src/app.js` to launch the frontend application.

## API Endpoints (Example - Adapt to your actual backend)

* `POST /user/login`: Login user.
* `POST /user`: Register user.
* `GET /user/:id`: Get user details (requires authentication).
* `GET /user/profile`: Get user profile (requires authentication).
* `PUT /user/profile/deposit`: Deposit coins (requires authentication).
* `PUT /user/profile/reset`: Reset deposit (requires authentication).
* `POST /user/purchase`: Purchase product (requires authentication).
* `POST /user/logout`: Logout user (requires authentication).
* `GET /products`: Get all products.
* `GET /products/:id`: Get product details.
* `POST /products/add`: Add product (requires authentication).
* `PUT /products/update/:id`: Update product (requires authentication).
* `DELETE /products/delete/:id`: Delete product (requires authentication).

## Usage

1.  Start the backend server.
2.  Open https://localhost:3001/ in your browser.
3.  Register or log in.
4.  If logged in as a seller, you can manage products, and buy products. // A soda seller could become thirsty sometime! :D
5.  If logged in as a buyer, you can deposit coins and buy products.

## Testing Guidelines

This project uses the following test libraries:
- Mocha – Test runner
- Chai – Assertion library
- Supertest – HTTP integration testing

### Setup

Install the dependencies for testing using:

```bash
npm install --save-dev mocha chai supertest
```

### Running the Tests

Run:

```bash
npm test
```
Logs are stored in /server/test-log.txt.

## Notes

*   This README provides a general overview. Refer to the code for specific implementation details.
*   The provided JavaScript code assumes a specific backend API structure. You'll need to adapt it if your backend is different.
*   Error handling and input validation could be improved.
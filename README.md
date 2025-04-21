# Vending Machine App

This project simulates a vending machine with user authentication, product management, and purchase functionality. It is built with a client-server architecture, featuring a React frontend and a Java Spring Boot backend.

## Features

* **Authentication:** Register and login with JWT-based authentication. Roles (buyer/seller) determine available actions.
* **User Management (Seller):** Sellers can view all users and logout all users.
* **Product Management (Seller):** Sellers can add, update, and delete products.
* **Purchase (Buyer):** Buyers can deposit coins, purchase products, and receive change.
* **Deposit/Reset (Buyer):** Buyers can deposit coins and reset their deposit.
* **Dynamic UI:** The frontend updates based on user role and login status.

## Technologies Used

* **Frontend:** React (JavaScript/HTML)
* **Backend:** Java (Spring Boot)
* **Database:** SQL Server

## Project Structure

```
/LocalScope/
  README.md                # Project overview (this file)
  /vending-machine-app/
    /java-server/          # Spring Boot backend
    /frontend/             # React frontend (location may vary)
```

## Setup

### Backend

1. See `/vending-machine-app/README.md` for backend setup and API documentation.

### Frontend

1. Navigate to the frontend directory (e.g., `/vending-machine-app/frontend`).
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the frontend server:
    ```bash
    npm start
    ```
   The frontend typically runs on [http://localhost:3001/](http://localhost:3001/).

### Environment

* Ensure the backend is running before using the frontend.

## Usage

1. Register or log in via the frontend.
2. Sellers can manage products and users.
3. Buyers can deposit coins and purchase products.

## Testing

* Backend: See `/vending-machine-app/README.md` and `doc/UserControllerTest.md`.
* Frontend: Use your preferred React testing tools.

## Notes

* The backend and frontend communicate via RESTful APIs.
* Adapt the frontend if your backend API differs from the provided structure.
* Error handling and input validation may need improvement.

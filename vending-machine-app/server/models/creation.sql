-- Create the database (if it doesn't exist)
CREATE DATABASE VendingMachineDB;
GO

-- Use the database
USE VendingMachineDB;
GO

-- Create the Users table
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,  -- Remember to hash passwords in your application!
    Role VARCHAR(50) CHECK (Role IN ('buyer', 'seller')) DEFAULT 'buyer',
    Deposit INT DEFAULT 0
);
GO

-- Create the Products table
CREATE TABLE Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductName VARCHAR(255) NOT NULL,
    AmountAvailable INT NOT NULL,
    Cost INT NOT NULL
);
GO
CREATE TABLE Orders (
    Id INT IDENTITY(1,1) PRIMARY KEY,  -- Auto-incrementing primary key
    UserId INT NOT NULL,
    OrderDate DATETIME NOT NULL,
    TotalPrice DECIMAL(10, 2) NOT NULL,
    OrderStatus VARCHAR(255) DEFAULT 'pending', -- Add order status
    FOREIGN KEY (UserId) REFERENCES Users(Id) -- Foreign key to Users table
);
GO
CREATE TABLE OrderItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(10, 2) NOT NULL, -- Price at the time of purchase
    FOREIGN KEY (OrderId) REFERENCES Orders(Id),
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
);
GO
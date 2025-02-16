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
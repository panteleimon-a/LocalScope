-- Use the database
USE VendingMachineDB;
GO

-- Create the DeletedProductsOrderHistory table
CREATE TABLE DeletedProductsOrderHistory (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    ProductName VARCHAR(255) NOT NULL,
    AmountAvailable INT NOT NULL,
    Cost INT NOT NULL,
    DeletedAt DATETIME NOT NULL DEFAULT GETDATE(),
    SellerId INT NOT NULL,
    FOREIGN KEY (SellerId) REFERENCES Users(Id)
);
GO
class Product {
  constructor(productName, amountAvailable, cost, sellerId) { // Include sellerId
      this.productName = productName;
      this.amountAvailable = amountAvailable;
      this.cost = cost;
      this.sellerId = sellerId; // Add sellerId
  }

  // Static method to create a Product from a database record
  static fromDb(record) {
    if (!record) return null; // Handle cases where the record is null

    const product = new Product(record.ProductName, record.AmountAvailable, record.Cost, record.SellerId);
    product.id = record.Id; // Set the ID after creation
    return product;
  }
}

module.exports = Product;
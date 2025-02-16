  class User {
    constructor(username, password, role = 'buyer', deposit = 0) {
      this.username = username;
      this.password = password;
      this.role = role;
      this.deposit = deposit;
    }
  }
  
  module.exports = User;
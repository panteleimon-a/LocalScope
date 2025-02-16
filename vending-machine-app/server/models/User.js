class User {
  constructor(username, password, role = 'buyer', deposit = 0) {
      if (!username || !password || !role) {
          throw new Error("Username, password, and role are required");
      }

      this.username = username;
      this.password = password;
      this.role = role;
      this.deposit = deposit;
  }

  static fromDb(record) {
      if (!record) return null;

      const user = new User(record.Username, record.Password, record.Role, record.Deposit);
      user.id = record.Id;
      return user;
  }
}

module.exports = User;
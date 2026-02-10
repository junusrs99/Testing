// User model (mock - replace with actual database model in production)
class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive
    };
  }

  // Exclude password from JSON
  toPublicJSON() {
    const json = this.toJSON();
    delete json.password;
    return json;
  }
}

module.exports = User;


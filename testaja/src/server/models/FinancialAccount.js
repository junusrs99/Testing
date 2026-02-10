// Financial Account model
class FinancialAccount {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.name = data.name;
    this.balance = data.balance || 0;
    this.type = data.type; // checking, savings, investment, credit
    this.accountNumber = data.accountNumber;
    this.institution = data.institution;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      balance: this.balance,
      type: this.type,
      accountNumber: this.accountNumber,
      institution: this.institution,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = FinancialAccount;


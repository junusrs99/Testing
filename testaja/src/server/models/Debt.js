// Debt model
class Debt {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.name = data.name;
    this.balance = data.balance;
    this.interestRate = data.interestRate;
    this.minPayment = data.minPayment;
    this.type = data.type; // credit_card, student_loan, mortgage, personal_loan
    this.dueDate = data.dueDate;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      balance: this.balance,
      interestRate: this.interestRate,
      minPayment: this.minPayment,
      type: this.type,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Debt;


// Transaction model
class Transaction {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.accountId = data.accountId;
    this.amount = data.amount;
    this.category = data.category;
    this.description = data.description;
    this.date = data.date || new Date();
    this.type = data.type || (data.amount >= 0 ? 'income' : 'expense');
    this.tags = data.tags || [];
    this.createdAt = data.createdAt || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      accountId: this.accountId,
      amount: this.amount,
      category: this.category,
      description: this.description,
      date: this.date,
      type: this.type,
      tags: this.tags,
      createdAt: this.createdAt
    };
  }
}

module.exports = Transaction;


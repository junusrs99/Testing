class CalculationHelper {
  /**
   * Calculate compound interest
   * @param {number} principal - Initial amount
   * @param {number} rate - Annual interest rate (as decimal)
   * @param {number} time - Time in years
   * @param {number} compoundFrequency - Number of times interest compounds per year
   * @returns {number} Final amount
   */
  static compoundInterest(principal, rate, time, compoundFrequency = 12) {
    return principal * Math.pow(1 + rate / compoundFrequency, compoundFrequency * time);
  }

  /**
   * Calculate monthly payment for loan
   * @param {number} principal - Loan amount
   * @param {number} rate - Annual interest rate (as decimal)
   * @param {number} months - Number of months
   * @returns {number} Monthly payment
   */
  static calculateMonthlyPayment(principal, rate, months) {
    const monthlyRate = rate / 12;
    if (monthlyRate === 0) {
      return principal / months;
    }
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }

  /**
   * Calculate total interest paid
   * @param {number} principal - Loan amount
   * @param {number} monthlyPayment - Monthly payment
   * @param {number} months - Number of months
   * @returns {number} Total interest
   */
  static calculateTotalInterest(principal, monthlyPayment, months) {
    return (monthlyPayment * months) - principal;
  }

  /**
   * Calculate debt payoff date
   * @param {number} balance - Current balance
   * @param {number} monthlyPayment - Monthly payment
   * @param {number} interestRate - Annual interest rate (as decimal)
   * @returns {Date} Payoff date
   */
  static calculatePayoffDate(balance, monthlyPayment, interestRate) {
    const monthlyRate = interestRate / 12;
    if (monthlyPayment <= balance * monthlyRate) {
      return null; // Will never pay off
    }
    const months = -Math.log(1 - (balance * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate);
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + Math.ceil(months));
    return payoffDate;
  }

  /**
   * Calculate net worth
   * @param {number} assets - Total assets
   * @param {number} liabilities - Total liabilities
   * @returns {number} Net worth
   */
  static calculateNetWorth(assets, liabilities) {
    return assets - liabilities;
  }

  /**
   * Calculate savings rate
   * @param {number} income - Monthly income
   * @param {number} expenses - Monthly expenses
   * @returns {number} Savings rate as percentage
   */
  static calculateSavingsRate(income, expenses) {
    if (income === 0) return 0;
    return ((income - expenses) / income) * 100;
  }
}

module.exports = CalculationHelper;


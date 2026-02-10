class DateHelper {
  /**
   * Format date to ISO string
   * @param {Date} date - Date object
   * @returns {string} ISO date string
   */
  static toISOString(date) {
    return date.toISOString().split('T')[0];
  }

  /**
   * Get start of month
   * @param {Date} date - Date object
   * @returns {Date} Start of month
   */
  static getStartOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  /**
   * Get end of month
   * @param {Date} date - Date object
   * @returns {Date} End of month
   */
  static getEndOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  /**
   * Add months to date
   * @param {Date} date - Date object
   * @param {number} months - Number of months to add
   * @returns {Date} New date
   */
  static addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  /**
   * Calculate difference in months
   * @param {Date} date1 - First date
   * @param {Date} date2 - Second date
   * @returns {number} Difference in months
   */
  static diffInMonths(date1, date2) {
    const months = (date2.getFullYear() - date1.getFullYear()) * 12;
    return months - date1.getMonth() + date2.getMonth();
  }

  /**
   * Format date for display
   * @param {Date} date - Date object
   * @returns {string} Formatted date string
   */
  static formatDate(date) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

module.exports = DateHelper;


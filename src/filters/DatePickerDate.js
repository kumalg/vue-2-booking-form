export default class DatePickerDate {
  constructor(year, month, day) {
    this.year = year
    this.month = month
    this.day = day
  }
  toString() {
    return `${this.year}-${this.month}-${this.day}`
  }
  equals(date) {
    if (date === null) return false
    return this.year == date.year && this.month == date.month && this.day == date.day
  }
  lessThan(date) {
    if (date === null) return false
    if (this.year < date.year) return true
    if (this.year === date.year && this.month < date.month) return true
    if (this.year === date.year && this.month === date.month && this.day < date.day) return true
    return false
  }
  greaterThan(date) {
    if (date === null) return false
    if (this.year > date.year) return true
    if (this.year === date.year && this.month > date.month) return true
    if (this.year === date.year && this.month === date.month && this.day > date.day) return true
    return false
  }
}

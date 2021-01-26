export default class DatePickerDate {
  constructor(year, month, day) {
    this.year = year
    this.month = month
    this.day = day
  }
  toString() {
    return `${this.year}-${this.month}-${this.day}`
  }
}

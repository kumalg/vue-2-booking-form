import { calendarViewDaysCount } from '../helpers'

export default {
  data() {
    return {
      pointer: null
    }
  },
  methods: {
    pointerSet(index) {
      this.pointer = index
    },
    pointerDown() {
      if (this.pointer !== null) {
        if (this.pointer + 7 >= calendarViewDaysCount) {
          this.nextMonth()
          this.pointer = (this.pointer + 7) % calendarViewDaysCount
        } else {
          this.pointer += 7
        }
      } else {
        this.pointer = 0
      }
    },
    pointerUp() {
      if (this.pointer !== null) {
        if (this.pointer < 7) {
          this.previousMonth()
          this.pointer = calendarViewDaysCount + this.pointer - 7
        } else {
          this.pointer -= 7
        }
      } else {
        this.pointer = calendarViewDaysCount - 7
      }
    },
    pointerLeft() {
      if (this.pointer !== null) {
        if (this.pointer < 1) {
          this.previousMonth()
          this.pointer = calendarViewDaysCount - 1
        } else {
          this.pointer -= 1
        }
      } else {
        this.pointer = calendarViewDaysCount - 1
      }
    },
    pointerRight() {
      if (this.pointer !== null) {
        if (this.pointer >= calendarViewDaysCount - 1) {
          this.nextMonth()
          this.pointer = 0
        } else {
          this.pointer += 1
        }
      } else {
        this.pointer = 0
      }
    }
  }
}

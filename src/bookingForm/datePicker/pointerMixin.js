import { CALENDAR_DAYS_COUNT } from './helpers'

export default {
  data () {
    return {
      pointer: null
    }
  },
  methods: {
    pointerSet (index) {
      this.pointer = index
    },
    pointerDown () {
      if (this.pointer !== null) {
        if (this.pointer + 7 >= CALENDAR_DAYS_COUNT) {
          if (this.canGoToNextMonth) {
            this.nextMonth()
            this.pointer = (this.pointer + 7) % CALENDAR_DAYS_COUNT
          }
        } else {
          this.pointer += 7
        }
      } else {
        this.pointer = 0
      }
    },
    pointerUp () {
      if (this.pointer !== null) {
        if (this.pointer < 7) {
          if (this.canGoToPreviousMonth) {
            this.previousMonth()
            this.pointer = CALENDAR_DAYS_COUNT + this.pointer - 7
          }
        } else {
          this.pointer -= 7
        }
      } else {
        this.pointer = CALENDAR_DAYS_COUNT - 7
      }
    },
    pointerLeft () {
      if (this.pointer !== null) {
        if (this.pointer < 1) {
          if (this.canGoToPreviousMonth) {
            this.previousMonth()
            this.pointer = CALENDAR_DAYS_COUNT - 1
          }
        } else {
          this.pointer -= 1
        }
      } else {
        this.pointer = CALENDAR_DAYS_COUNT - 1
      }
    },
    pointerRight () {
      if (this.pointer !== null) {
        if (this.pointer >= CALENDAR_DAYS_COUNT - 1) {
          if (this.canGoToNextMonth) {
            this.nextMonth()
            this.pointer = 0
          }
        } else {
          this.pointer += 1
        }
      } else {
        this.pointer = 0
      }
    }
  }
}

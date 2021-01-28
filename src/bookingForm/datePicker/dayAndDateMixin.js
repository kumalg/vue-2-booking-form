import 'dayjs/locale/pl'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isToday from 'dayjs/plugin/isToday'
import localeData from 'dayjs/plugin/localeData'
import objectSupport from 'dayjs/plugin/objectSupport'
// import updateLocale from 'dayjs/plugin/updateLocale'

import { CALENDAR_DAYS_COUNT } from './helpers'

dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(isToday)
dayjs.extend(localeData)
dayjs.extend(objectSupport)
// dayjs.extend(updateLocale)
// dayjs.locale('pl')

export default {
  props: {
    value: {
      type: Object
    },
    minDate: {
      type: Object
    },
    maxDate: {
      type: Object
    },
    excludeDates: {
      type: Array
    }
  },
  data () {
    return {
      tempDateFrom: this.value?.dateFrom,
      tempDateTo: this.value?.dateTo,
      currentMonth: this.getInitialMonth(),
      weekdays: this.getWeekdays()
    }
  },
  methods: {
    getInitialMonth () {
      const existedDate = this.value?.dateFrom || this.value?.dateTo
      return existedDate ? dayjs({ year: existedDate.year, month: existedDate.month - 1 }) : dayjs().startOf('month')
    },
    getWeekdays () {
      return dayjs.weekdaysShort(true)
    },
    toDayJsInstance ({ year, month, day }) {
      return dayjs({ year, month: month - 1, day })
    }
  },
  computed: {
    previousMonthDays () {
      const previousMonth = this.currentMonth.subtract(1, 'month')
      const year = previousMonth.year()
      const month = previousMonth.month()
      const days = previousMonth.daysInMonth()
      const needsDays = Math.max(this.currentMonth.day() - dayjs.localeData().firstDayOfWeek(), 0)
      const shift = days - needsDays + 1

      return Array.from({ length: needsDays }, (_, i) => i + shift).map(day => dayjs({ year, month, day }))
    },
    currentMonthDays () {
      const year = this.currentMonth.year()
      const month = this.currentMonth.month()
      const days = this.currentMonth.daysInMonth()

      return Array.from({ length: days }, (_, i) => i + 1).map(day => dayjs({ year, month, day }))
    },
    nextMonthDays () {
      const nextMonth = this.currentMonth.add(1, 'month')
      const year = nextMonth.year()
      const month = nextMonth.month()
      const needsDays = CALENDAR_DAYS_COUNT - this.previousMonthDays.length - this.currentMonthDays.length

      return Array.from({ length: needsDays }, (_, i) => i + 1).map(day => dayjs({ year, month, day }))
    },
    allVisibleDays () {
      const allDays = [...this.previousMonthDays, ...this.currentMonthDays, ...this.nextMonthDays]
      return allDays.map(d => {
        return {
          date: d,
          selected: this.dateFromParsed?.isSameOrBefore(d, 'day') && this.dateToParsed?.isSameOrAfter(d, 'day'),
          selectedFrom: this.dateFromParsed?.isSame(d, 'day'),
          selectedTo: this.dateToParsed?.isSame(d, 'day'),
          otherMonth: !this.currentMonth.isSame(d, 'month'),
          excluded:
            this.minDateParsed?.isAfter(d, 'day') ||
            this.maxDateParsed?.isBefore(d, 'day') ||
            this.excludeDatesParsed.some(day => day.isSame(d, 'day')),
          today: d.isToday()
        }
      })
    },
    dateFromParsed () {
      return this.value?.dateFrom ? this.toDayJsInstance(this.value.dateFrom) : null
    },
    dateToParsed () {
      return this.value?.dateTo ? this.toDayJsInstance(this.value.dateTo) : null
    },
    minDateParsed () {
      return this.minDate ? this.toDayJsInstance(this.minDate) : null
    },
    maxDateParsed () {
      return this.maxDate ? this.toDayJsInstance(this.maxDate) : null
    },
    excludeDatesParsed () {
      if (this.excludeDates && Array.isArray(this.excludeDates)) {
        return this.excludeDates.map(this.toDayJsInstance)
      }
      return []
    }
  }
}

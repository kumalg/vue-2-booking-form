<template>
  <button @click="previousMonth()">
    <Icon icon="angleLeft"></Icon>
  </button>
  {{ selectedYear }} - {{ selectedMonth }}
  <button @click="nextMonth()">
    <Icon icon="angleRight"></Icon>
  </button>

  <button @click="nextMonth()">
    dateFrom
  </button>
  <button @click="nextMonth()">
    dateFrom
  </button>

  <div class="date-picker__calendar">
    <div
      @click="selectDate(dateObj.date)"
      v-for="dateObj in allVisibleDays"
      :key="dateObj.date.toString()"
      :class="calendarItemClassList(dateObj)"
    >
      <div class="date-picker__calendar__item__inner">
        {{ dateObj.date.day }}
      </div>
    </div>
  </div>
</template>

<script>
import DatePickerDate from '@/filters/DatePickerDate'

export default {
  props: {
    dateFrom: {
      type: DatePickerDate
    },
    dateTo: {
      type: DatePickerDate
    }
  },
  data() {
    return {
      tempDateFrom: this.dateFrom,
      tempDateTo: this.dateTo,
      selectedYear: 2021,
      selectedMonth: 1
    }
  },
  methods: {
    calendarItemClassList({ otherMonth, selected, selectedFrom }) {
      return [
        'date-picker__calendar__item',
        {
          'date-picker__calendar__item--other-month': otherMonth
        },
        {
          'date-picker__calendar__item--selected': selected
        },
        {
          'date-picker__calendar__item--selected-from': selectedFrom
        }
      ]
    },
    setDateFrom(val) {
      this.tempDateFrom = new DatePickerDate(2021, val, 25)
    },
    setDateTo(val) {
      this.tempDateTo = new DatePickerDate(2021, val, 25)
    },
    previousMonth() {
      if (this.selectedMonth <= 1) {
        this.selectedMonth = 12
        this.selectedYear--
      } else {
        this.selectedMonth--
      }
    },
    nextMonth() {
      if (this.selectedMonth >= 12) {
        this.selectedMonth = 1
        this.selectedYear++
      } else {
        this.selectedMonth++
      }
    },
    selectDate(date) {
      this.tempDateFrom = this.dateFrom !== null && this.dateFrom.equals(date) ? null : date
    },
    daysInMonth(year, month) {
      return new Date(year, month, 0).getDate()
    }
  },
  computed: {
    prevMonthDays() {
      const currentMonthDate = new Date(this.selectedYear, this.selectedMonth, 1)
      const prevMonthDate = new Date(currentMonthDate.setMonth(currentMonthDate.getMonth() - 1))
      const needsDays = Math.max(prevMonthDate.getDay() - 1, 0)
      const prevMonthDays = this.daysInMonth(prevMonthDate.getYear(), prevMonthDate.getMonth() + 1)
      const array = Array.from({ length: prevMonthDays }, (_, i) => i + 1)
      return array
        .slice(Math.max(array.length - needsDays, 0))
        .map(day => new DatePickerDate(prevMonthDate.getYear(), prevMonthDate.getMonth() + 1, day))
    },
    daysInSelectedMonth() {
      const days = this.daysInMonth(this.selectedYear, this.selectedMonth)
      return Array.from({ length: days }, (_, i) => i + 1).map(
        day => new DatePickerDate(this.selectedYear, this.selectedMonth, day)
      )
    },
    nextMonthDays() {
      const days = 7 * 6 - this.prevMonthDays.length - this.daysInSelectedMonth.length
      return Array.from({ length: days }, (_, i) => i + 1).map(
        day => new DatePickerDate(this.selectedYear, this.selectedMonth + 1, day)
      )
    },
    allVisibleDays() {
      const allDays = [...this.prevMonthDays, ...this.daysInSelectedMonth, ...this.nextMonthDays]
      return allDays.map(d => {
        return {
          date: d,
          selected: this.dateFrom !== null && this.dateFrom.lessThan(d),
          selectedFrom: this.dateFrom !== null && this.dateFrom.equals(d),
          otherMonth: this.selectedYear !== d.year || this.selectedMonth !== d.month
        }
      })
    }
  },
  watch: {
    tempDateFrom(newValue) {
      this.$emit('update:dateFrom', newValue)
    },
    tempDateTo(newValue) {
      this.$emit('update:dateTo', newValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.date-picker {
  &__calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    &__item {
      text-align: center;
      cursor: pointer;
      font-size: 0.875rem;
      margin: 4px 0;
      box-sizing: border-box;
      position: relative;

      &__inner {
        position: relative;
        $size: 40px;
        height: $size;
        width: $size;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $size;
        box-sizing: border-box;
        transition-property: background-color, color;
        transition-duration: 0.2s;
        transition-timing-function: ease;
      }

      &:not(&--selected-from):hover &__inner {
        background-color: rgba($primary, 0.1);
        color: $primary;
      }

      &--other-month &__inner {
        color: $border;
      }

      &--selected &__inner {
        color: $primary;
      }

      &--other-month#{ & }--selected &__inner {
        color: rgba($primary, 0.25);
      }

      &--selected-from &__inner {
        font-weight: bold;
        color: #fff;
        background-color: $primary;
      }

      &--selected,
      &--selected-from {
        &:before {
          content: '';
          position: absolute;
          background: rgba($primary, 0.1);
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }
      }

      &--selected-from:before {
        left: 50%;
      }
    }
  }
}
</style>

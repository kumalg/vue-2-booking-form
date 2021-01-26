<template>
  <div class="date-picker">
    <div class="date-picker__inputs">
      <div
        @click="selectedDateType = 'dateFrom'"
        :class="['date-picker__inputs__input', { 'date-picker__inputs__input--checked': selectedDateType === 'dateFrom' }]"
      >
        {{ dateFrom ? dateFrom.toString() : 'Check In' }}
      </div>
      <Icon icon="angleRight"></Icon>
      <div
        @click="selectedDateType = 'dateTo'"
        :class="['date-picker__inputs__input', { 'date-picker__inputs__input--checked': selectedDateType === 'dateTo' }]"
      >
        {{ dateTo ? dateTo.toString() : 'Check Out' }}
      </div>
    </div>

    <div class="date-picker__popup">
      <button @click="previousMonth()">
        <Icon icon="angleLeft"></Icon>
      </button>
      {{ selectedYear }} - {{ selectedMonth }}
      <button @click="nextMonth()">
        <Icon icon="angleRight"></Icon>
      </button>
      <div class="date-picker__popup__calendar-container">
        <transition name="calendar-slide">
          <div class="date-picker__calendar" :key="`${selectedYear}-${selectedMonth}`">
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
        </transition>
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
      selectedMonth: 1,
      selectedDateType: null
    }
  },
  methods: {
    calendarItemClassList({ otherMonth, selected, selectedFrom, selectedTo }) {
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
        },
        {
          'date-picker__calendar__item--selected-to': selectedTo
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
      if (this.selectedDateType === 'dateFrom') {
        this.tempDateFrom = date
        if (!this.tempDateTo) {
          this.selectedDateType = 'dateTo'
        }
      } else if (this.selectedDateType === 'dateTo') {
        this.tempDateTo = date
        if (!this.tempDateFrom) {
          this.selectedDateType = 'dateTo'
        }
      }
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
          selected: this.dateFrom !== null && this.dateTo !== null && this.dateFrom.lessThan(d) && this.dateTo.greaterThan(d),
          selectedFrom: this.dateFrom !== null && this.dateFrom.equals(d),
          selectedTo: this.dateTo !== null && this.dateTo.equals(d),
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
.calendar-slide-enter-active,
.calendar-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.calendar-slide-enter-from {
  transform: translatey(-100%);
}

.calendar-slide-leave-to {
  transform: translatey(100%);
}

.calendar-slide-enter-from,
.calendar-slide-leave-to {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.date-picker {
  position: relative;

  &__inputs {
    height: 40px;
    width: 100%;
    display: flex;
    border: 1px solid $border;
    border-radius: 40px;
    align-items: center;

    &__input {
      flex: 1;
      padding: 8px 16px;
      font-size: 0.875rem;
      cursor: pointer;

      &--checked {
        font-weight: bold;
      }
    }
  }

  &__popup {
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    position: absolute;
    background: white;
    box-shadow: 0 8px 48px -8px rgba(0, 0, 0, 0.2);
    border-radius: 24px;
    overflow: hidden;
    padding: 24px;

    &__calendar-container {
      position: relative;
      overflow: hidden;
    }
  }

  &__calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    &__item {
      text-align: center;
      font-size: 0.875rem;
      margin: 4px 0;
      box-sizing: border-box;
      position: relative;
      cursor: pointer;

      &__inner {
        position: relative;
        $size: 32px;
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

      &:before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        transition: background-color 0.2s ease;
      }

      &:not(&--selected-from):not(&--selected-to):hover &__inner {
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

      &--selected-from &__inner,
      &--selected-to &__inner {
        font-weight: bold;
        color: #fff;
        background-color: $primary;
      }

      &--selected,
      &--selected-from,
      &--selected-to {
        &:before {
          background-color: rgba($primary, 0.1);
        }
      }

      &--selected-from:before {
        left: 50%;
      }

      &--selected-to:before {
        right: 50%;
      }
    }
  }
}
</style>

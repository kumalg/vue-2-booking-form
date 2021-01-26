<template>
  <div class="date-picker">
    <div class="date-picker__inputs">
      <div
        @click="selectedDateType = 'dateFrom'"
        :class="['date-picker__inputs__input', { 'date-picker__inputs__input--checked': selectedDateType === 'dateFrom' }]"
      >
        {{ dateFrom ? dateFrom.format('D MMM YYYY') : 'Check In' }}
      </div>
      <Icon icon="angleRight"></Icon>
      <div
        @click="selectedDateType = 'dateTo'"
        :class="['date-picker__inputs__input', { 'date-picker__inputs__input--checked': selectedDateType === 'dateTo' }]"
      >
        {{ dateTo ? dateTo.format('D MMM YYYY') : 'Check Out' }}
      </div>
    </div>

    <div class="date-picker__popup">
      <div class="date-picker__popup__header">
        <button @click="previousMonth()">
          <Icon icon="angleLeft"></Icon>
        </button>
        <div class="date-picker__popup__header__month">{{ currentMonth.format('MMMM YYYY') }}</div>
        <button @click="nextMonth()">
          <Icon icon="angleRight"></Icon>
        </button>
      </div>

      <div class="date-picker__popup__calendar-container">
        <transition name="calendar-slide">
          <div class="date-picker__calendar" :key="currentMonth.format('MM-YYYY')">
            <div
              @click="setDate(dateObj.date)"
              v-for="dateObj in allVisibleDays"
              :key="dateObj.date.format('DD-MM-YYYY')"
              :class="calendarItemClassList(dateObj)"
            >
              <div class="date-picker__calendar__item__inner">
                {{ dateObj.date.date() }}
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import objectSupport from 'dayjs/plugin/objectSupport'
import DatePickerDate from '@/filters/DatePickerDate'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(objectSupport)

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
      currentMonth: this.getInitialMonth(),
      selectedDateType: null
    }
  },
  methods: {
    getInitialMonth() {
      const existedDate = this.dateFrom || this.dateTo
      return existedDate ? dayjs({ year: existedDate.year, month: existedDate.month }) : dayjs().startOf('month')
    },
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
    previousMonth() {
      this.currentMonth = this.currentMonth.subtract(1, 'month')
    },
    nextMonth() {
      this.currentMonth = this.currentMonth.add(1, 'month')
    },
    setDate(date) {
      if (this.selectedDateType === 'dateFrom') {
        this.setDateFrom(date)
      } else if (this.selectedDateType === 'dateTo') {
        this.setDateTo(date)
      }
    },
    setDateFrom(date) {
      if (this.dateTo && this.dateTo.isBefore(date)) {
        this.setDateTo(date)
      } else {
        this.tempDateFrom = date
      }
      this.selectedDateType = 'dateTo'
    },
    setDateTo(date) {
      if (this.dateFrom && this.dateFrom.isAfter(date)) {
        this.tempDateTo = null
        this.setDateFrom(date)
      } else {
        this.tempDateTo = date
      }
      if (!this.dateFrom) {
        this.selectedDateType = 'dateFrom'
      }
    }
  },
  computed: {
    previousMonthDays() {
      const previousMonth = this.currentMonth.subtract(1, 'month')
      const previousMonthDays = previousMonth.daysInMonth()
      const needsDays = Math.max(this.currentMonth.day() - 1, 0)
      const shift = previousMonthDays - needsDays + 1

      return Array.from({ length: needsDays }, (_, i) => i + shift).map(day =>
        dayjs({ year: previousMonth.year(), month: previousMonth.month(), day })
      )
    },
    currentMonthDays() {
      const days = this.currentMonth.daysInMonth()
      return Array.from({ length: days }, (_, i) => i + 1).map(day =>
        dayjs({ year: this.currentMonth.year(), month: this.currentMonth.month(), day })
      )
    },
    nextMonthDays() {
      const nextMonth = this.currentMonth.add(1, 'month')
      const needsDays = 7 * 6 - this.previousMonthDays.length - this.currentMonthDays.length

      return Array.from({ length: needsDays }, (_, i) => i + 1).map(day =>
        dayjs({ year: nextMonth.year(), month: nextMonth.month(), day })
      )
    },
    allVisibleDays() {
      const allDays = [...this.previousMonthDays, ...this.currentMonthDays, ...this.nextMonthDays]
      return allDays.map(d => {
        return {
          date: d,
          selected: this.dateFrom?.isSameOrBefore(d, 'day') && this.dateTo?.isSameOrAfter(d, 'day'),
          selectedFrom: this.dateFrom?.isSame(d, 'day'),
          selectedTo: this.dateTo?.isSame(d, 'day'),
          otherMonth: !this.currentMonth.isSame(d, 'month')
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

    &__header {
      display: flex;
      align-items: center;

      &__month {
        flex: 1;
        text-align: center;
      }
    }

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

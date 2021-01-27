<template>
  <div :class="['date-picker', { '--opened': opened }]" @click="open()">
    <div class="date-picker__inputs">
      <div
        ref="dateFromElement"
        tabindex="1"
        @focus="selectDateFrom()"
        @blur="hide($event)"
        :class="['date-picker__input i1', { '--checked': selectedDateType === SelectedTypes.DATE_FROM }]"
      >
        <div v-if="dateFrom" class="date-picker__input__value">
          {{ dateFrom.format('D MMM YYYY') }}
        </div>
        <div v-else-if="dateFromPlaceholder" class="date-picker__input__placeholder">
          {{ dateFromPlaceholder }}
        </div>
        <span v-show="dateFrom" @mousedown.prevent @click.prevent="tempDateFrom = null" class="date-picker__input__clear">
          <Icon icon="crossSmall" />
        </span>
      </div>
      <Icon icon="arrowRight"></Icon>
      <div
        ref="dateToElement"
        tabindex="1"
        @focus="selectDateTo()"
        @blur="hide($event)"
        :class="['date-picker__input i2', { '--checked': selectedDateType === SelectedTypes.DATE_TO }]"
      >
        <div v-if="dateTo" class="date-picker__input__value">
          {{ dateTo.format('D MMM YYYY') }}
        </div>
        <div v-else-if="dateToPlaceholder" class="date-picker__input__placeholder">
          {{ dateToPlaceholder }}
        </div>
        <span v-show="dateTo" @mousedown.prevent @click.prevent="tempDateTo = null" class="date-picker__input__clear">
          <Icon icon="crossSmall" />
        </span>
      </div>
    </div>

    <transition name="popup-fade">
      <div v-show="opened" class="date-picker__popup" @mousedown.prevent>
        <div class="date-picker__popup__header">
          <button @click="previousMonth()">
            <Icon icon="angleLeft"></Icon>
          </button>
          <div class="date-picker__popup__header__month">
            <transition
              :name="lastMonthChangeDirection === Direction.PREVIOUS ? 'calendar-slide-previous' : 'calendar-slide-next'"
            >
              <div :key="currentMonth.format('MM-YYYY')">{{ currentMonth.format('MMMM YYYY') }}</div>
            </transition>
          </div>
          <button @click="nextMonth()">
            <Icon icon="angleRight"></Icon>
          </button>
        </div>

        <div class="date-picker__popup__weekdays">
          <div class="date-picker__popup__weekdays__day" v-for="weekday in weekdays" :key="weekday">
            {{ weekday }}
          </div>
        </div>

        <div class="date-picker__popup__calendar-container">
          <transition
            :name="lastMonthChangeDirection === Direction.PREVIOUS ? 'calendar-slide-previous' : 'calendar-slide-next'"
          >
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
    </transition>
  </div>
</template>

<script>
import 'dayjs/locale/pl'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isToday from 'dayjs/plugin/isToday'
import localeData from 'dayjs/plugin/localeData'
import updateLocale from 'dayjs/plugin/updateLocale'
import objectSupport from 'dayjs/plugin/objectSupport'
import DatePickerDate from '@/filters/DatePickerDate'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(isToday)
dayjs.extend(localeData)
dayjs.extend(objectSupport)
dayjs.extend(updateLocale)
dayjs.locale('pl')

const SelectedTypes = {
  DATE_FROM: 'date_from',
  DATE_TO: 'date_to'
}

const Direction = {
  PREVIOUS: 'previous',
  NEXT: 'next'
}

export default {
  props: {
    dateFrom: {
      type: DatePickerDate
    },
    dateTo: {
      type: DatePickerDate
    },
    dateFromPlaceholder: {
      type: String
    },
    dateToPlaceholder: {
      type: String
    }
  },
  data() {
    return {
      Direction,
      SelectedTypes,
      tempDateFrom: this.dateFrom,
      tempDateTo: this.dateTo,
      currentMonth: this.getInitialMonth(),
      weekdays: this.getWeekdays(),
      selectedDateType: null,
      opened: false,
      lastMonthChangeDirection: Direction.NEXT
    }
  },
  methods: {
    open() {
      if (this.opened) return
      this.opened = true

      if (!this.selectedDateType) {
        this.$refs.dateFromElement.focus()
      }
    },
    hide(event) {
      const newFocused = event.relatedTarget
      if (!this.opened || newFocused === this.$refs.dateFromElement || newFocused === this.$refs.dateToElement) return

      this.selectedDateType = null
      this.opened = false
    },
    selectDateFrom() {
      this.selectedDateType = SelectedTypes.DATE_FROM
      this.open()
    },
    selectDateTo() {
      this.selectedDateType = SelectedTypes.DATE_TO
      this.open()
    },
    getInitialMonth() {
      const existedDate = this.dateFrom || this.dateTo
      return existedDate ? dayjs({ year: existedDate.year, month: existedDate.month }) : dayjs().startOf('month')
    },
    getWeekdays() {
      return dayjs.weekdaysShort(true)
    },
    previousMonth() {
      this.lastMonthChangeDirection = Direction.PREVIOUS
      this.currentMonth = this.currentMonth.subtract(1, 'month')
    },
    nextMonth() {
      this.lastMonthChangeDirection = Direction.NEXT
      this.currentMonth = this.currentMonth.add(1, 'month')
    },
    setDate(date) {
      if (this.selectedDateType === SelectedTypes.DATE_FROM) {
        this.setDateFrom(date)
      } else if (this.selectedDateType === SelectedTypes.DATE_TO) {
        this.setDateTo(date)
      }
    },
    setDateFrom(date) {
      if (this.dateTo && this.dateTo.isBefore(date)) {
        this.tempDateFrom = date
        this.setDateTo(null)
      } else {
        this.tempDateFrom = date
      }
      this.selectedDateType = SelectedTypes.DATE_TO
    },
    setDateTo(date) {
      if (this.dateFrom && this.dateFrom.isAfter(date)) {
        this.tempDateTo = null
        this.setDateFrom(date)
      } else {
        this.tempDateTo = date
      }
      if (!this.dateFrom) {
        this.selectedDateType = SelectedTypes.DATE_FROM
      }
    },
    calendarItemClassList({ otherMonth, selected, selectedFrom, selectedTo, today }) {
      return [
        'date-picker__calendar__item',
        {
          '--other-month': otherMonth,
          '--selected': selected,
          '--selected-from': selectedFrom,
          '--selected-to': selectedTo,
          '--today': today
        }
      ]
    }
  },
  computed: {
    previousMonthDays() {
      const previousMonth = this.currentMonth.subtract(1, 'month')
      const year = previousMonth.year()
      const month = previousMonth.month()
      const days = previousMonth.daysInMonth()
      const needsDays = Math.max(this.currentMonth.day() - dayjs.localeData().firstDayOfWeek(), 0)
      const shift = days - needsDays + 1

      return Array.from({ length: needsDays }, (_, i) => i + shift).map(day => dayjs({ year, month, day }))
    },
    currentMonthDays() {
      const year = this.currentMonth.year()
      const month = this.currentMonth.month()
      const days = this.currentMonth.daysInMonth()

      return Array.from({ length: days }, (_, i) => i + 1).map(day => dayjs({ year, month, day }))
    },
    nextMonthDays() {
      const nextMonth = this.currentMonth.add(1, 'month')
      const year = nextMonth.year()
      const month = nextMonth.month()
      const needsDays = 7 * 6 - this.previousMonthDays.length - this.currentMonthDays.length

      return Array.from({ length: needsDays }, (_, i) => i + 1).map(day => dayjs({ year, month, day }))
    },
    allVisibleDays() {
      const allDays = [...this.previousMonthDays, ...this.currentMonthDays, ...this.nextMonthDays]
      return allDays.map(d => {
        return {
          date: d,
          selected: this.dateFrom?.isSameOrBefore(d, 'day') && this.dateTo?.isSameOrAfter(d, 'day'),
          selectedFrom: this.dateFrom?.isSame(d, 'day'),
          selectedTo: this.dateTo?.isSame(d, 'day'),
          otherMonth: !this.currentMonth.isSame(d, 'month'),
          today: d.isToday()
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
.popup-fade {
  &-enter-active,
  &-leave-active {
    @include transition((transform, opacity));
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(-16px);
  }
}

.calendar-slide-previous,
.calendar-slide-next {
  &-enter-active,
  &-leave-active {
    @include transition((opacity, transform), 0.3s);
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.calendar-slide-previous {
  &-enter-from {
    transform: translateY(-100%);
  }

  &-leave-to {
    transform: translateY(100%);
  }
}

.calendar-slide-next {
  &-enter-from {
    transform: translateY(100%);
  }

  &-leave-to {
    transform: translateY(-100%);
  }
}

.date-picker {
  position: relative;
  min-width: 320px;
  outline: none;

  &.--opened &__inputs {
    border-color: rgba($primary, 0.5);
  }

  &__inputs {
    height: 48px;
    width: 100%;
    display: flex;
    border: 1px solid $border;
    border-radius: 48px;
    align-items: center;
    cursor: pointer;
    @include transition((border-color));
  }

  &__input {
    flex: 1;
    margin: 4px 8px;
    padding: 8px 12px;
    border-radius: 40px;
    font-size: 0.875rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    outline: none;
    @include transition(background-color);

    &__value,
    &__placeholder {
      @include transition(color);
    }

    &.--checked {
      background-color: rgba($primary, 0.1);
    }

    &:hover &__placeholder,
    &.--checked &__placeholder {
      color: rgba($primary, 0.5);
    }

    &:hover &__value,
    &.--checked &__value {
      color: $primary;
    }

    &__placeholder {
      color: $text-secondary;
    }

    &__clear {
      margin-left: auto;
      background-color: transparent;
      border: none;
      font-size: 1rem;
      line-height: 0;
      padding: 0;
      border-radius: 1rem;
      color: rgba($text-primary, 0.5);
      @include transition(color);
      cursor: pointer;

      &:hover {
        color: $red;
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
      border: 1px solid $border;
      border-radius: 50px;
      padding: 12px;
      height: 48px;

      &__month {
        flex: 1;
        text-align: center;
        font-size: 0.875rem;
        font-weight: bold;
        position: relative;
        // overflow: hidden;
      }

      button {
        font-size: 1rem;
        background: transparent;
        border: none;
        line-height: 0;
        cursor: pointer;
        @include transition((color));

        &:hover {
          color: $primary;
        }
      }
    }

    &__weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      margin: 1rem 0 0.75rem 0;

      &__day {
        text-align: center;
        font-size: 0.75rem;
        color: $text-secondary;
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
      font-size: 0.75rem;
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
        @include transition((background-color, color));
      }

      &:before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        @include transition((background-color));
      }

      &:not(.--selected-from):not(.--selected-to):hover &__inner {
        background-color: rgba($primary, 0.1);
        color: $primary;
      }

      &.--today &__inner {
        border: 2px solid rgba($primary, 0.5);
        color: $primary;
      }

      &.--other-month &__inner {
        color: $border;
      }

      &.--selected &__inner {
        color: $primary;
      }

      &.--other-month.--selected &__inner {
        color: rgba($primary, 0.25);
      }

      &.--selected-from &__inner,
      &.--selected-to &__inner {
        font-weight: bold;
        color: #fff;
        background-color: $primary;
      }

      &.--selected {
        &:before {
          background-color: rgba($primary, 0.1);
        }
      }

      &.--selected-from:before {
        left: 50%;
      }

      &.--selected-to:before {
        right: 50%;
      }
    }
  }
}
</style>

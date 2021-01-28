<template>
  <div
    ref="mainElement"
    :class="['date-picker', { '--opened': opened }]"
    @keydown.down.prevent="pointerDown()"
    @keydown.up.prevent="pointerUp()"
    @keydown.left.prevent="pointerLeft()"
    @keydown.right.prevent="pointerRight()"
    @keydown.enter.prevent="setDate()"
    @keydown.esc="hide()"
    @focus="open()"
    tabindex="-1"
  >
    <div class="date-picker__inputs">
      <div ref="dateFromElement" @focus="selectDateFrom()" @blur="hide($event)" tabindex="1" class="date-picker__input">
        <div v-if="dateFromParsed" class="date-picker__input__value">
          {{ dateFromParsed.format('D MMM YYYY') }}
        </div>
        <div v-else-if="dateFromPlaceholder" class="date-picker__input__placeholder">
          {{ dateFromPlaceholder }}
        </div>
        <span v-show="dateFromParsed" @mousedown.prevent @click.prevent="tempDateFrom = null" class="date-picker__input__clear">
          <Icon icon="crossSmall" />
        </span>
      </div>
      <Icon icon="arrowRight"></Icon>
      <div ref="dateToElement" @focus="selectDateTo()" @blur="hide($event)" tabindex="1" class="date-picker__input">
        <div v-if="dateToParsed" class="date-picker__input__value">
          {{ dateToParsed.format('D MMM YYYY') }}
        </div>
        <div v-else-if="dateToPlaceholder" class="date-picker__input__placeholder">
          {{ dateToPlaceholder }}
        </div>
        <span v-show="dateToParsed" @mousedown.prevent @click.prevent="tempDateTo = null" class="date-picker__input__clear">
          <Icon icon="crossSmall" />
        </span>
      </div>
    </div>

    <transition name="popup-fade">
      <div v-show="opened" :class="['date-picker__popup', { '--above': isAbove }]" @mousedown.prevent>
        <div class="date-picker__popup__header">
          <button @click="previousMonth(true)" :disabled="!canGoToPreviousMonth" tabindex="-1">
            <Icon icon="angleLeft"></Icon>
          </button>
          <div class="date-picker__popup__header__month">
            <transition :name="calendarTransitionName">
              <div :key="currentMonth.format('MM-YYYY')">{{ currentMonth.format('MMMM YYYY') }}</div>
            </transition>
          </div>
          <button :disabled="!canGoToNextMonth" @click="nextMonth(true)" tabindex="-1">
            <Icon icon="angleRight"></Icon>
          </button>
        </div>

        <div class="date-picker__popup__weekdays">
          <div v-for="weekday in weekdays" :key="weekday" class="date-picker__popup__weekdays__day">
            {{ weekday }}
          </div>
        </div>

        <div class="date-picker__popup__calendar-container">
          <transition :name="calendarTransitionName">
            <div :key="currentMonth.format('MM-YYYY')" class="date-picker__calendar">
              <div
                v-for="(dateObj, index) in allVisibleDays"
                :key="dateObj.date.format('DD-MM-YYYY')"
                :class="calendarItemClassList(dateObj, index)"
                @click="setDate(dateObj.date)"
                @mouseenter.self="pointerSet(index)"
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
import Icon from '../Icon'
import pointerMixin from './pointerMixin'
import dayAndDateMixin from './dayAndDateMixin'
import { SelectedTypes, Direction, OpenDirection } from './helpers'

export default {
  name: 'DatePicker',
  mixins: [dayAndDateMixin, pointerMixin],
  props: {
    dateFromPlaceholder: {
      type: String
    },
    dateToPlaceholder: {
      type: String
    }
  },
  components: {
    Icon
  },
  data () {
    return {
      selectedDateType: null,
      opened: false,
      lastMonthChangeDirection: Direction.NEXT,
      preferredOpenDirection: OpenDirection.BELOW
    }
  },
  methods: {
    open () {
      if (this.opened) return
      this.opened = true

      if (!this.selectedDateType) {
        this.$refs.dateFromElement.focus()
      }

      this.adjustPosition()
    },
    hide (event) {
      const newFocused = event?.relatedTarget
      if (
        !this.opened ||
        newFocused === this.$refs.dateFromElement ||
        newFocused === this.$refs.dateToElement ||
        newFocused === this.$refs.mainElement
      ) {
        return
      }

      this.pointer = null
      this.selectedDateType = null
      this.opened = false
      this.$refs.dateFromElement.blur()
      this.$refs.dateToElement.blur()
      this.$refs.mainElement.blur()
    },
    selectDateFrom () {
      this.selectedDateType = SelectedTypes.DATE_FROM
      this.open()
    },
    selectDateTo () {
      this.selectedDateType = SelectedTypes.DATE_TO
      this.open()
    },
    previousMonth (resetPointer) {
      if (!this.canGoToPreviousMonth) return
      if (resetPointer) {
        this.pointer = null
      }
      this.lastMonthChangeDirection = Direction.PREVIOUS
      this.currentMonth = this.currentMonth.subtract(1, 'month')
    },
    nextMonth (resetPointer) {
      if (!this.canGoToNextMonth) return
      if (resetPointer) {
        this.pointer = null
      }
      this.lastMonthChangeDirection = Direction.NEXT
      this.currentMonth = this.currentMonth.add(1, 'month')
    },
    setDate (date) {
      let actualDate = date
      if (!actualDate && this.pointer) {
        actualDate = this.allVisibleDays[this.pointer].date
      }

      if (this.selectedDateType === SelectedTypes.DATE_FROM) {
        this.setDateFrom(actualDate)
      } else if (this.selectedDateType === SelectedTypes.DATE_TO) {
        this.setDateTo(actualDate)
      }
    },
    setDateFrom (date) {
      if (
        this.minDateParsed?.isAfter(date) ||
        this.maxDateParsed?.isBefore(date) ||
        this.excludeDatesParsed.some(d => d.isSame(date, 'day'))
      ) {
        return
      }

      if (this.dateToParsed && this.excludeDatesParsed.some(d => d.isBetween(date, this.dateToParsed, 'day'))) {
        return
      }
      if (this.dateToParsed && this.dateToParsed.isBefore(date)) {
        this.tempDateFrom = date
        this.setDateTo(null)
      } else {
        this.tempDateFrom = date
      }
      this.$refs.dateToElement.focus()
    },
    setDateTo (date) {
      if (
        this.minDateParsed?.isAfter(date) ||
        this.maxDateParsed?.isBefore(date) ||
        this.excludeDatesParsed.some(d => d.isSame(date, 'day'))
      ) {
        return
      }

      if (this.dateFromParsed && this.excludeDatesParsed.some(d => d.isBetween(date, this.dateFromParsed, 'day'))) {
        return
      }
      if (this.dateFromParsed && this.dateFromParsed.isAfter(date)) {
        this.tempDateTo = null
        this.setDateFrom(date)
      } else {
        this.tempDateTo = date
      }
      if (!this.dateFromParsed) {
        this.$refs.dateFromElement.focus()
      }
    },
    adjustPosition () {
      if (typeof window === 'undefined') return
      const spaceAbove = this.$el.getBoundingClientRect().top
      const spaceBelow = window.innerHeight - this.$el.getBoundingClientRect().bottom
      const hasEnoughSpaceBelow = spaceBelow > 400

      if (hasEnoughSpaceBelow || spaceBelow > spaceAbove) {
        this.preferredOpenDirection = OpenDirection.BELOW
      } else {
        this.preferredOpenDirection = OpenDirection.ABOVE
      }
    },
    calendarItemClassList ({ otherMonth, selected, selectedFrom, selectedTo, today, excluded }, index) {
      return [
        'date-picker__calendar__item',
        {
          '--other-month': otherMonth,
          '--selected': selected,
          '--selected-from': selectedFrom,
          '--selected-to': selectedTo,
          '--today': today,
          '--excluded': excluded,
          '--highlighted': index === this.pointer
        }
      ]
    }
  },
  computed: {
    calendarTransitionName () {
      return this.lastMonthChangeDirection === Direction.PREVIOUS ? 'calendar-slide-previous' : 'calendar-slide-next'
    },
    isAbove () {
      return this.preferredOpenDirection === OpenDirection.ABOVE
    },
    canGoToPreviousMonth () {
      return this.minDateParsed ? this.minDateParsed.isBefore(this.currentMonth, 'month') : true
    },
    canGoToNextMonth () {
      return this.maxDateParsed ? this.maxDateParsed.isAfter(this.currentMonth, 'month') : true
    }
  },
  watch: {
    tempDateFrom (val) {
      const newValue = {
        ...this.value,
        dateFrom: val ? { year: val.year(), month: val.month() + 1, day: val.date() } : null
      }
      this.$emit('input', newValue)
    },
    tempDateTo (val) {
      const newValue = {
        ...this.value,
        dateTo: val ? { year: val.year(), month: val.month() + 1, day: val.date() } : null
      }
      this.$emit('input', newValue)
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

  &-enter,
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

  &-enter,
  &-leave-to {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

$transform-size: 400% / 6;

.calendar-slide-previous {
  &-enter {
    transform: translateY(-$transform-size);
  }

  &-leave-to {
    transform: translateY($transform-size);
  }
}

.calendar-slide-next {
  &-enter {
    transform: translateY($transform-size);
  }

  &-leave-to {
    transform: translateY(-$transform-size);
  }
}

.date-picker {
  position: relative;
  min-width: 300px;
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
    -webkit-tap-highlight-color: transparent;
    @include transition((border-color));
  }

  &__input {
    flex: 1;
    margin: 4px 8px;
    padding: 8px 12px;
    border-radius: 40px;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    outline: none;
    cursor: pointer;
    @include transition(background-color);

    &__value,
    &__placeholder {
      @include transition(color);
    }

    &:focus {
      background-color: rgba($primary, 0.1);
    }

    &:hover &__placeholder,
    &:focus &__placeholder {
      color: rgba($primary, 0.5);
    }

    &:hover &__value,
    &:focus &__value {
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
    background-color: #fff;
    box-shadow: 0 8px 48px -8px rgba(0, 0, 0, 0.2);
    border-radius: 24px;
    overflow: hidden;
    padding: 24px;

    &.--above {
      top: initial;
      bottom: calc(100% + 8px);
    }

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
      }

      button {
        font-size: 1rem;
        background: transparent;
        border: none;
        line-height: 0;
        @include transition((color));

        &:not(:disabled):hover {
          color: $primary;
          cursor: pointer;
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
      user-select: none;
      -webkit-tap-highlight-color: transparent;

      &:not(.--excluded) {
        cursor: pointer;
      }

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

      &:not(.--selected-from):not(.--selected-to).--excluded.--highlighted &__inner {
        background-color: rgba($border, 0.25);
      }

      &:not(.--selected-from):not(.--selected-to):not(.--excluded).--highlighted &__inner {
        background-color: rgba($primary, 0.1);
        color: $primary;
      }

      &.--today &__inner {
        border: 2px solid rgba($primary, 0.5);
        color: $primary;
      }

      &.--excluded &__inner,
      &.--other-month &__inner {
        color: $border;
      }

      &.--selected &__inner {
        color: $primary;
      }

      &.--other-month.--selected &__inner {
        color: rgba($primary, 0.25);
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

      &.--other-month.--selected-from &__inner,
      &.--other-month.--selected-to &__inner,
      &.--selected-from &__inner,
      &.--selected-to &__inner {
        font-weight: bold;
        color: #fff;
        background-color: $primary;
      }
    }
  }
}
</style>

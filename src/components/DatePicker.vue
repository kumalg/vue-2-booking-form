<template>
  <button @click="previousMonth()">
    <Icon icon="angleLeft"></Icon>
  </button>
  {{ selectedYear }} - {{ selectedMonth }}
  <button @click="nextMonth()">
    <Icon icon="angleRight"></Icon>
  </button>
  <div class="date-picker__calendar">
    <div v-for="prevMonthDay in prevMonthDays" :key="`prev-${prevMonthDay}`" class="date-picker__calendar__pre-item">
      {{ prevMonthDay }}
    </div>
    <div
      @click="selectDate(selectedYear, selectedMonth, day)"
      v-for="day in daysInSelectedMonth"
      :key="`current-${day}`"
      class="date-picker__calendar__item"
    >
      {{ day }}
    </div>
    <div v-for="nextMonthDay in nextMonthDays" :key="`next-${nextMonthDay}`" class="date-picker__calendar__pre-item">
      {{ nextMonthDay }}
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
    selectDate(year, month, day) {
      this.tempDateFrom = new DatePickerDate(year, month, day)
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
      let array = Array.from({ length: prevMonthDays }, (_, i) => i + 1)
      return array.slice(Math.max(array.length - needsDays, 0))
    },
    daysInSelectedMonth() {
      return this.daysInMonth(this.selectedYear, this.selectedMonth)
    },
    nextMonthDays() {
      return 7 * 6 - this.prevMonthDays.length - this.daysInSelectedMonth
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

    &__pre-item,
    &__item {
      text-align: center;
      cursor: pointer;
      font-size: 0.875rem;
      padding: 12px;
    }

    &__pre-item {
      color: $border;
    }
  }
}
</style>

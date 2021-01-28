<template>
  <div class="booking-form">
    <div class="booking-form__price">{{ currency(price) }}</div>
    <div class="booking-form__rating">
      <Rating :value="rating" :reviewsCount="reviewsCount"></Rating>
    </div>
    <div class="booking-form__date-picker">
      <DatePicker
        v-model="tempValue"
        :dateFromPlaceholder="dateFromPlaceholder"
        :dateToPlaceholder="dateToPlaceholder"
        :minDate="minDate"
        :maxDate="maxDate"
        :excludeDates="excludeDates"
      ></DatePicker>
    </div>
  </div>
</template>

<script>
import currency from './currency'

import Rating from './Rating'
import DatePicker from './datePicker/DatePicker'

export default {
  name: 'BookingForm',
  props: {
    value: {
      type: Object
    },
    price: {
      type: Number,
      required: true
    },
    rating: {
      type: Number
    },
    reviewsCount: {
      type: Number
    },
    dateFromPlaceholder: {
      type: String
    },
    dateToPlaceholder: {
      type: String
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
  components: { Rating, DatePicker },
  data () {
    return {
      tempValue: this.value
    }
  },
  methods: {
    currency
  },
  watch: {
    tempValue (newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.booking-form {
  max-width: 512px;
  width: 100%;
  margin: auto;
  padding: 1.5rem;
  border-radius: 1.5rem;
  background-color: #fff;
  box-shadow: 0 24px 48px -16px rgba(0, 0, 0, 0.1);

  &__price {
    font-size: 1.5rem;
    font-weight: bold;
  }

  &__rating {
    margin-top: 8px;
  }

  &__date-picker {
    margin-top: 16px;
  }
}
</style>

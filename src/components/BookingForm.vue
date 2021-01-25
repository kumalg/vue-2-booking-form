<template>
  <div class="booking-form">
    <div class="booking-form__price">{{ currency(price) }}</div>
    <div class="booking-form__rating">
      <Rating :rating="rating" :reviewsCount="reviewsCount"></Rating>
    </div>
  </div>
</template>

<script>
import currency from '@/filters/currency'
import Rating from './Rating.vue'

export default {
  components: { Rating },
  name: 'BookingForm',
  methods: {
    currency
  },
  props: {
    price: {
      type: Number,
      required: true
    },
    rating: {
      type: Number
    },
    reviewsCount: {
      type: Number
    }
  }
}
</script>

<style lang="scss" scoped>
.booking-form {
  &__price {
  }
  &__rating {
  }
}
</style>

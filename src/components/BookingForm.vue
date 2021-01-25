<template>
  <div class="booking-form">
    <div class="booking-form__price">{{ currency(price) }}</div>
    <div class="booking-form__rating">
      <Rating :value="rating" :reviewsCount="reviewsCount"></Rating>
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
  max-width: 320px;
  width: 100%;
  border: 1px solid rgb(128, 128, 128);
  margin: auto;
  padding: 1rem;

  &__price {
    font-size: 1.5rem;
    font-weight: bold;
  }
  &__rating {
  }
}
</style>

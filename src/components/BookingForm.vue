<template>
  <div></div>
</template>

<script>
export default {
  name: 'BookingForm',
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

<style lang="scss" scoped></style>

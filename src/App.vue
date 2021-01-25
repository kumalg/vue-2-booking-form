<template>
  <BookingForm :price="price" :rating="rating" :reviewsCount="reviewsCount"></BookingForm>
</template>

<script>
import BookingForm from './components/BookingForm.vue'

export default {
  name: 'App',
  data() {
    return {
      price: 298,
      rating: 3.5,
      reviewsCount: 123
    }
  },
  components: { BookingForm }
}
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>

<template>
  <div>
    <BookingForm :price="price" :rating="rating" :reviewsCount="reviewsCount"></BookingForm>
  </div>
</template>

<script>
import BookingForm from './components/BookingForm.vue'

export default {
  name: 'App',
  data() {
    return {
      price: 298,
      rating: 4.5,
      reviewsCount: 123
    }
  },
  components: { BookingForm }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

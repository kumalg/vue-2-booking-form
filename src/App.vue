<template>
  <div>
    <!-- {{ form }} -->
    <BookingForm
      v-model:dateFrom="form.dateFrom"
      v-model:dateTo="form.dateTo"
      dateFromPlaceholder="Przyjazd"
      dateToPlaceholder="Wyjazd"
      :price="form.price"
      :rating="form.rating"
      :reviewsCount="form.reviewsCount"
    ></BookingForm>
  </div>
</template>

<script>
import BookingForm from './components/BookingForm.vue'

export default {
  name: 'App',
  components: { BookingForm },
  data() {
    return {
      form: {
        price: 298,
        rating: 3.5,
        reviewsCount: 123,
        dateFrom: null,
        dateTo: null
      }
    }
  }
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

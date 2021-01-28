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
      :minDate="minDate"
      :maxDate="maxDate"
      :excludeDates="excludeDates"
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
      minDate: {
        year: 2020,
        month: 12,
        day: 15
      },
      maxDate: {
        year: 2021,
        month: 12,
        day: 15
      },
      excludeDates: [
        {
          year: 2021,
          month: 1,
          day: 27
        },
        {
          year: 2021,
          month: 1,
          day: 22
        }
      ],
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

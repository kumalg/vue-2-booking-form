<template>
  <div>
    <div class="app-booking-form">
      <BookingForm
        v-model="form.dateRange"
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
    <div class="app-form">
      {{ form }}
    </div>
  </div>
</template>

<script>
import BookingForm from './bookingForm/BookingForm'

export default {
  name: 'App',
  components: { BookingForm },
  data () {
    return {
      form: {
        price: 298,
        rating: 3.5,
        reviewsCount: 123,
        dateRange: {
          dateFrom: null,
          dateTo: null
        }
      },
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
          day: 6
        },
        {
          year: 2021,
          month: 1,
          day: 7
        }
      ]
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

.app-booking-form {
  max-width: 420px;
  margin: auto;
}

.app-form {
  margin-top: 32px;
  font-size: 0.875rem;
  color: $text-secondary;
  min-height: 128px;
}
</style>

<template>
  <div class="app">
    <div class="app-booking-form">
      <BookingForm
        v-model="form.dateRange"
        dateFromPlaceholder="Check In"
        dateToPlaceholder="Check Out"
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
    <div class="app-booking-form">
      <BookingForm
        v-model="form2.dateRange"
        dateFromPlaceholder="Check In"
        dateToPlaceholder="Check Out"
        :price="form2.price"
        :rating="form2.rating"
        :reviewsCount="form2.reviewsCount"
        :minDate="minDate"
        :maxDate="maxDate"
        :excludeDates="excludeDates"
      ></BookingForm>
    </div>
    <div class="app-form">
      {{ form2 }}
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
          dateFrom: {
            year: 2021,
            month: 1,
            day: 15
          },
          dateTo: null
        }
      },
      form2: {
        price: 499.99,
        rating: 4.5,
        reviewsCount: 6436,
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
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap');

body,
html {
  height: 100%;
  padding: 0;
  margin: 0;
}

body {
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  background-color: #fcfcfc;
}

* {
  box-sizing: border-box;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}

.app {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  padding: 8px;
}

.app-booking-form {
  max-width: 420px;
  margin: 0 auto;
}

.app-form {
  margin-top: 32px;
  font-size: 0.875rem;
  color: #999;
  min-height: 128px;
  padding: 8px;
}
</style>

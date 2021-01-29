<template>
  <div class="app">
    <div class="app-booking-form">
      <BookingForm
        v-model="form"
        :dateFromPlaceholder="props.dateFromPlaceholder"
        :dateToPlaceholder="props.dateToPlaceholder"
        :price="props.price"
        :rating="props.rating"
        :reviewsCount="props.reviewsCount"
        :minDate="props.minDate"
        :maxDate="props.maxDate"
        :excludeDates="props.excludeDates"
      ></BookingForm>
    </div>
    <div class="app-form">
      <div><b>props:</b> {{ props }}</div>
      <div><b>model:</b> {{ form }}</div>
    </div>
    <div class="app-booking-form">
      <BookingForm
        v-model="form2"
        :dateFromPlaceholder="props.dateFromPlaceholder"
        :dateToPlaceholder="props.dateToPlaceholder"
        :price="props2.price"
        :rating="props2.rating"
        :reviewsCount="props2.reviewsCount"
        :minDate="props2.minDate"
        :maxDate="props2.maxDate"
        :excludeDates="props2.excludeDates"
      ></BookingForm>
    </div>
    <div class="app-form">
      <div><b>props:</b> {{ props2 }}</div>
      <div><b>model:</b> {{ form2 }}</div>
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
      props: {
        dateFromPlaceholder: 'Check In',
        dateToPlaceholder: 'Check Out',
        price: 298,
        rating: 3.5,
        reviewsCount: 123,
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
      },
      form: {
        dateFrom: {
          year: 2021,
          month: 1,
          day: 15
        },
        dateTo: null
      },
      props2: {
        dateFromPlaceholder: 'Date from',
        dateToPlaceholder: 'Date to',
        price: 499.99,
        rating: 4.5,
        reviewsCount: 6436,
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
      },
      form2: {
        dateFrom: null,
        dateTo: null
      }
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

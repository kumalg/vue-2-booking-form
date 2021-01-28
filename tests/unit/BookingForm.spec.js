import { shallowMount } from '@vue/test-utils'
import BookingForm from '@/bookingForm/BookingForm'

describe('BookingForm.vue', () => {
  it('should render price', () => {
    const price = 259

    const wrapper = shallowMount(BookingForm, {
      props: { price }
    })

    const priceElement = wrapper.find('.booking-form__price')
    expect(priceElement.text()).toMatch(/259\szł/)
  })
})

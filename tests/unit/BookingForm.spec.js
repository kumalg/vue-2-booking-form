import { shallowMount } from '@vue/test-utils'
import BookingForm from '@/bookingForm/BookingForm.vue'

describe('BookingForm.vue', () => {
  it('should render price', () => {
    const price = 259

    const wrapper = shallowMount(BookingForm, {
      propsData: { price }
    })

    const priceElement = wrapper.find('.booking-form__price')
    expect(priceElement.text()).toMatch(/259\szł/)
  })
})

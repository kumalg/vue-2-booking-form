import { shallowMount } from '@vue/test-utils'
import BookingForm from '@/components/BookingForm.vue'

describe('BookingForm.vue', () => {
  it('should render price', () => {
    const price = 259
    const priceWithCurrency = '259 zł'

    const wrapper = shallowMount(BookingForm, {
      props: { price }
    })

    const priceElement = wrapper.find('.booking-form__price')
    expect(priceElement.text()).toBe(priceWithCurrency)
  })
})

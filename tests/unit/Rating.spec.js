import { shallowMount } from '@vue/test-utils'
import Rating from '@/bookingForm/Rating.vue'

describe('Rating.vue', () => {
  it('should render proper stars style', () => {
    const wrapper = shallowMount(Rating, {
      propsData: { value: 3 }
    })

    expect(wrapper.vm.filledStarsStyle?.width).toMatch(/60%/)
  })
  it('should render reviews count', () => {
    const wrapper = shallowMount(Rating, {
      propsData: { reviewsCount: 123 }
    })

    expect(wrapper.find('.rating__reviews').text()).toMatch(/123/)
  })
})

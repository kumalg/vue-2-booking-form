import { mount, shallowMount } from '@vue/test-utils'
import DatePicker from '@/bookingForm/datePicker/DatePicker.vue'

describe('DatePicker.vue', () => {
  it('should show popup when "opened" value is true', async () => {
    const wrapper = shallowMount(DatePicker)

    wrapper.setData({ opened: true })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.date-picker__calendar').isVisible()).toBe(true)
  })
  it('should show popup when focus on date picker', async () => {
    const wrapper = shallowMount(DatePicker)

    wrapper.find('.date-picker').trigger('focus')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.date-picker__calendar').isVisible()).toBe(true)
  })
  it('should show popup when focus on date from input', async () => {
    const wrapper = shallowMount(DatePicker)

    wrapper.vm.$refs.dateFromElement.focus()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.date-picker__calendar').isVisible()).toBe(true)
  })
  it('should show popup when focus on date to input', async () => {
    const wrapper = shallowMount(DatePicker)

    wrapper.vm.$refs.dateToElement.focus()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.date-picker__calendar').isVisible()).toBe(true)
  })

  it('should show "date from" placeholder when "date from" is not sey', () => {
    var parent = mount({
      template: '<div> <date-picker dateFromPlaceholder="Check In"></date-picker> </div>',
      components: { 'date-picker': DatePicker }
    })
    expect(parent.find('.date-picker__input').text()).toMatch(/Check In/)
  })

  it('should show "date to" placeholder when "date from" is not sey', () => {
    var parent = mount({
      template: '<div> <date-picker dateToPlaceholder="Check Out"></date-picker> </div>',
      components: { 'date-picker': DatePicker }
    })
    expect(parent.findAll('.date-picker__input').at(1).text()).toMatch(/Check Out/)
  })
})
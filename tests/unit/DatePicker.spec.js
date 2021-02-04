import { mount } from '@vue/test-utils'
import DatePicker from '@/bookingForm/datePicker/DatePicker.vue'

describe('DatePicker.vue', () => {
  it('should show popup when "opened" value is true', async () => {
    const wrapper = mount(DatePicker)

    wrapper.setData({ opened: true })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.date-picker__calendar').isVisible()).toBe(true)
  })
  it('should show popup when focus on date picker', async () => {
    const wrapper = mount(DatePicker)

    wrapper.find('.date-picker').trigger('focus')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.date-picker__calendar').isVisible()).toBe(true)
  })
  it('should show popup when focus on date from input', async () => {
    const wrapper = mount(DatePicker)

    wrapper.vm.$refs.dateFromElement.focus()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.date-picker__calendar').isVisible()).toBe(true)
  })
  it('should show popup when focus on date to input', async () => {
    const wrapper = mount(DatePicker)

    wrapper.vm.$refs.dateToElement.focus()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.date-picker__calendar').isVisible()).toBe(true)
  })

  it('should show "date from" placeholder when "date from" is not set', () => {
    const wrapper = mount(DatePicker, {
      propsData: {
        dateFromPlaceholder: 'Check In'
      }
    })
    expect(wrapper.find('.date-picker__input').text()).toMatch(/Check In/)
  })
  it('should show "date to" placeholder when "date to" is not set', () => {
    const wrapper = mount(DatePicker, {
      propsData: {
        dateToPlaceholder: 'Check Out'
      }
    })
    expect(wrapper.findAll('.date-picker__input').at(1).text()).toMatch(/Check Out/)
  })

  it('should show "date from" formatted date when "date from" is set', () => {
    const wrapper = mount(DatePicker, {
      propsData: {
        dateFromPlaceholder: 'Check In',
        value: {
          dateFrom: {
            year: 2020,
            month: 10,
            day: 10
          }
        }
      }
    })
    expect(wrapper.find('.date-picker__input').text()).toMatch(/10 Oct 2020/)
  })
  it('should show "date to" formatted date when "date to" is set', () => {
    const wrapper = mount(DatePicker, {
      propsData: {
        dateToPlaceholder: 'Check Out',
        value: {
          dateTo: {
            year: 2020,
            month: 10,
            day: 10
          }
        }
      }
    })
    expect(wrapper.findAll('.date-picker__input').at(1).text()).toMatch(/10 Oct 2020/)
  })

  it('should clear "date from" value when clear button clicked', async () => {
    var parent = mount({
      data () {
        return {
          model: {
            dateFrom: {
              year: 2020,
              month: 10,
              day: 10
            }
          }
        }
      },
      template: '<div> <date-picker v-model="model" dateFromPlaceholder="Check In"></date-picker> </div>',
      components: { 'date-picker': DatePicker }
    })
    expect(parent.findAll('.date-picker__input').at(0).text()).toMatch(/10 Oct 2020/)

    await parent.findAll('.date-picker__input__clear').at(0).trigger('click')

    expect(parent.findAll('.date-picker__input').at(0).text()).toMatch(/Check In/)
  })
  it('should clear "date to" value when clear button clicked', async () => {
    var parent = mount({
      data () {
        return {
          model: {
            dateTo: {
              year: 2020,
              month: 10,
              day: 10
            }
          }
        }
      },
      template: '<div> <date-picker v-model="model" dateToPlaceholder="Check Out"></date-picker> </div>',
      components: { 'date-picker': DatePicker }
    })
    expect(parent.findAll('.date-picker__input').at(1).text()).toMatch(/10 Oct 2020/)

    await parent.findAll('.date-picker__input__clear').at(1).trigger('click')

    expect(parent.findAll('.date-picker__input').at(1).text()).toMatch(/Check Out/)
  })
})

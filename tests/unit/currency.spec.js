import currency from '@/bookingForm/currency'

// Needs Node 13+ https://stackoverflow.com/a/56624712/7526135
describe('currency', () => {
  it('should render price without decimal if not necessary', () => {
    const price = 259
    const formattedPrice = currency(price)
    expect(formattedPrice).toMatch(/259\szł/)
  })
  it('should render price with two decimal if value has one decimal', () => {
    const price = 259.5
    const formattedPrice = currency(price)
    expect(formattedPrice).toMatch(/259,50\szł/)
  })
  it('should render price with two decimal if value has more than two decimals', () => {
    const price = 259.123
    const formattedPrice = currency(price)
    expect(formattedPrice).toMatch(/259,12\szł/)
  })
  it('should render price with two decimal', () => {
    const price = 259.49
    const formattedPrice = currency(price)
    expect(formattedPrice).toMatch(/259,49\szł/)
  })
})

import currency from '@/filters/currency'

// Needs Node 13+ https://stackoverflow.com/a/56624712/7526135
describe('currency', () => {
  it('should render price without decimal if not necessary', () => {
    const price = 259
    const formattedPrice = currency(price)
    expect(formattedPrice).toEqual('259 zł')
  })
  it('should render price with two decimal if value has one decimal', () => {
    const price = 259.5
    const formattedPrice = currency(price)
    expect(formattedPrice).toEqual('259,50 zł')
  })
  it('should render price with two decimal if value has more than two decimals', () => {
    const price = 259.123
    const formattedPrice = currency(price)
    expect(formattedPrice).toEqual('259,12 zł')
  })
  it('should render price with two decimal', () => {
    const price = 259.49
    const formattedPrice = currency(price)
    expect(formattedPrice).toEqual('259,49 zł')
  })
})

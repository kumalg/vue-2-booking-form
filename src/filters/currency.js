export default function(value) {
  if (typeof value !== 'number' && value !== null) {
    console.error('currency: value must be a Number')
  }
  return value
    .toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })
    .replace(',00', '')
    .replace(/\s/g, ' ')
}

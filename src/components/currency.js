export default function currency(value, locale = 'pl-PL', currency = 'PLN', fractionDigits = 2) {
  if (typeof value !== 'number' && value !== null) {
    console.error('currency: value must be a number')
  }
  const finalFractionDigits = value % 1 === 0 ? 0 : fractionDigits
  return value.toLocaleString(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: finalFractionDigits,
    maximumFractionDigits: finalFractionDigits
  })
}

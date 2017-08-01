const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

function toCurrency (value) {
  return currencyFormatter.format(value)
}

export default toCurrency

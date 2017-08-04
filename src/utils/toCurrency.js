import commafy from 'commafy'

/*
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})
*/

function toCurrency (value) {
  // return currencyFormatter.format(value)
  return `$${commafy(value)}`
}

export default toCurrency

function url (ticker) {
  return `https://api.coinmarketcap.com/v1/ticker/${ticker}/?convert=USD`
}

async function priceStats () {
  const result = await Promise.all([
    window.fetch(url('ethereum')),
    window.fetch(url('adtoken'))
  ])

  const result1 = await result[0].json()
  const result2 = await result[1].json()

  const ethUsd = parseFloat(result1[0].price_usd, 10)
  const adtUsd = parseFloat(result2[0].price_usd, 10)

  return Promise.resolve({ethUsd, adtUsd})
}

export default priceStats


export const renderAirSwap = () => {
  try {
    window.AirSwap.Trader.render({
      mode: 'buy',
      amount: '',
      env: 'production',
      token: '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd',
      onCancel: function () {
        console.info('Trade was cancelled.')
      },
      onComplete: function (transactionId, makerAmount, makerToken, takerAmount, takerToken) {
        window.alert('Trade complete. Thank you, come again.')
      }
    }, 'body')
  } catch (error) {
    console.log(error)
  }
}

const { getProviderUrl } = require('../config')

module.exports = {
  getProvider () {
    if (window.web3) {
      return window.web3.currentProvider
    } else {
      const provider = new window.Web3.providers.HttpProvider(getProviderUrl())
      return provider
    }
  }
}

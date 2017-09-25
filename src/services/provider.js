const { getProviderUrl } = require('../config')

module.exports = {
  getProvider () {
    if (window.web3) {
      return window.web3.currentProvider
    } else {
      return new window.Web3.providers.HttpProvider(getProviderUrl())
    }
  }
}

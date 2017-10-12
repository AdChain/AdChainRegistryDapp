import Eth from 'ethjs'

export const getProviderUrl = () => {
  const net = 'rinkeby'
  if (net === 'testrpc') {
    return 'http://localhost:8545'
  } else {
    return `https://${net}.infura.io:443`
  }
}

export const getProvider = () => {
  if (window.web3) {
    return window.web3.currentProvider
  } else {
    const provider = new Eth.HttpProvider(getProviderUrl())
    return provider
  }
}

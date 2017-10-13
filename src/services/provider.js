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
  if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
    return window.web3.currentProvider
  } else {
    return new Eth.HttpProvider(getProviderUrl())
  }
}

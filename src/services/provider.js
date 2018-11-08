import Eth from 'ethjs'
import { network, websocketNetwork } from '../models/network'

export const getProviderUrl = () => {
  if (network === 'testrpc') {
    return 'http://localhost:8545'
  } else {
    return `https://${websocketNetwork}.infura.io:443`
  }
}

export const getPermissions = async () => {
  if (window.ethereum) {
    window.web3 = new window.Web3(window.ethereum)
    try {
      await window.ethereum.enable()
    } catch (error) {
      console.log('User denied account access...')
    }
  }
}

export const getProvider = () => {
  if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
    return window.web3.currentProvider
  } else {
    return new Eth.HttpProvider(getProviderUrl())
  }
}

export const getWebsocketProvider = () => {
  // https://github.com/ethereum/web3.js/issues/1119
  if (!window.Web3.providers.WebsocketProvider.prototype.sendAsync) {
    window.Web3.providers.WebsocketProvider.prototype.sendAsync = window.Web3.providers.WebsocketProvider.prototype.send
  }
  return new window.Web3.providers.WebsocketProvider(`wss://${websocketNetwork}.infura.io/_ws`)
}

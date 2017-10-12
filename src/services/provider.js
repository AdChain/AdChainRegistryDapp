import Eth from 'ethjs'
import { getProviderUrl } from '../config'

export const getProvider = () => {
  if (window.web3) {
    return window.web3.currentProvider
  } else {
    const provider = new Eth.HttpProvider(getProviderUrl())
    return provider
  }
}

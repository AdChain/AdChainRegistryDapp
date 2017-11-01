import Eth from 'ethjs'
import { getProvider } from './provider'
import { getToken } from '../config'
import store from '../store'

class TokenService {
  constructor () {
    this.address = null
    this.token = null
    this.decimals = 9
    this.name = null
    this.symbol = null
  }

  async init () {
    /* important to check for provider in
     * init function (rather than constructor),
     * so that injected web3 has time to load.
     */
    this.eth = new Eth(getProvider())
    const accounts = await this.eth.accounts()
    this.token = await getToken(accounts[0])
    this.address = this.token.address

    this.getDecimals()
    this.getName()
    this.getSymbol()

    store.dispatch({
      type: 'TOKEN_CONTRACT_INIT'
    })
  }

  setUpEvents () {
    this.token.allEvents()
      .watch((error, log) => {
        if (error) {
          console.error(error)
          return false
        }

        store.dispatch({
          type: 'TOKEN_EVENT'
        })
      })
  }

  getName () {
    return new Promise(async (resolve, reject) => {
      try {
        const name = await this.token.name()
        this.name = name
        resolve(name)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  getSymbol () {
    return new Promise(async (resolve, reject) => {
      try {
        const symbol = await this.token.symbol()
        this.symbol = symbol
        resolve(symbol)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  getDecimals () {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.token.decimals()
        const decimals = result.toNumber()

        if (decimals) {
          this.decimals = decimals
        }

        resolve(this.decimals)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  balanceOf (account) {
    return new Promise(async (resolve, reject) => {
      if (!account) {
        reject(new Error('Account is required'))
        return false
      }

      try {
        const result = await this.token.balanceOf(account)
        const balance = result.toNumber() / Math.pow(10, this.decimals)
        resolve(balance)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  async approve (sender, value = -1) {
    return new Promise(async (resolve, reject) => {
      if (!sender) {
        reject(new Error('Sender is required'))
        return false
      }

      try {
        const result = await this.token.approve(sender, value)

        store.dispatch({
          type: 'TOKEN_APPROVE',
          value
        })

        resolve(result)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  async allowance (owner, spender) {
    return this.token.allowance.call(owner, spender)
  }

  async getBalance () {
    const balance = await this.balanceOf(this.getAccount())
    return balance
  }

  getAccount () {
    if (!window.web3) {
      return null
    }

    return window.web3.eth.defaultAccount || window.web3.eth.accounts[0]
  }
}

export default new TokenService()

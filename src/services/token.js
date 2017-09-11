import tc from 'truffle-contract' // truffle-contract

import { getAddress, getAbi } from '../config'
import store from '../store'
import Token from '../config/token.json'

const address = getAddress('token')
const abi = getAbi('token')

class TokenService {
  constructor () {
    this.address = address
    this.token = null
    this.decimals = 9
    this.name = null
    this.symbol = null

    this.initContract()
  }

  async initContract () {
    if (!window.web3) {
      return false
    }

    if (this.pendingDeployed) {
      await this.pendingDeployed
      this.pendingDeploy = null
      return false
    }

    if (!this.token) {
      const contract = tc(Token)
      contract.setProvider(window.web3.currentProvider)
      this.pendingDeployed = contract.at(address)
      const deployed = await this.pendingDeployed
      this.token = deployed
      this.pendingDeploy = null

      this.getDecimals()
      this.getName()
      this.getSymbol()
    }
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
      if (!this.token) {
        await this.initContract()
      }

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
      if (!this.token) {
        await this.initContract()
      }

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
      if (!this.token) {
        await this.initContract()
      }

      try {
        const result = await this.token.decimals()
        this.decimals = result.toNumber()
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

      if (!this.token) {
        await this.initContract()
      }

      try {
        const result = await this.token.balanceOf(account, {from: this.getAccount()})
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

      if (!this.token) {
        await this.initContract()
      }

      try {
        const result = await this.token.approve(sender, value, {from: this.getAccount()})
        resolve(result)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
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

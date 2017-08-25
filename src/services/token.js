import pify from 'pify'

const {token:address} = require('../config/address.json')
const abi = require('../config/token.json').abi

class TokenService {
  constructor () {
    this.address = address
    this.token = null
    this.decimals = null
    this.name = null
    this.symbol = null

    this.initContract()
  }

  initContract () {
    if (!window.web3) {
      return false
    }

    if (!this.token) {
      this.token = window.web3.eth.contract(abi).at(this.address)

      this.getDecimals()
      this.getName()
      this.getSymbol()
    }
  }

  getName () {
    return new Promise(async (resolve, reject) => {
      if (!this.token) {
        this.initContract()
      }

      try {
        const name = await pify(this.token.name)()
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
        this.initContract()
      }

      try {
        const symbol = await pify(this.token.symbol)()
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
        this.initContract()
      }

      try {
        const result = await pify(this.token.decimals)()
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
        this.initContract()
      }

      try {
        const result = await pify(this.token.balanceOf)(account)
        const balance = result.toNumber() / Math.pow(10, this.decimals)
        resolve(balance)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  async approve (sender, value=0) {
    return new Promise(async (resolve, reject) => {
      if (!sender) {
        reject(new Error('Sender is required'))
        return false
      }

      if (!this.token) {
        this.initContract()
      }

      try {
        const result = await pify(this.token.approve)(sender, value)
        resolve(result)
        return false
      } catch(error) {
        reject(error)
        return false
      }
    })
  }
}

export default new TokenService()
